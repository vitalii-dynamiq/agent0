'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { AIChat } from '@/components/shared/ai-chat';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { AIMessage } from '@/lib/types';
import { decisions, getPendingDecisionsForChairman, getTodaysMeetings, getUpcomingMeetings } from '@/lib/mock-data';
import { ChevronRightIcon } from '@radix-ui/react-icons';

const quickPrompts = [
  { id: 'brief', label: 'Priority brief', prompt: 'Give me the priority brief for today.' },
  { id: 'status', label: 'Decision status', prompt: 'Show decision status updates and items awaiting approval.' },
  { id: 'approve', label: 'Approve top decision', prompt: 'Approve the top decision after a quick review.' },
  { id: 'schedule', label: "Today's schedule", prompt: "Show today's schedule with locations and prep notes." },
  { id: 'meeting-brief', label: 'Meeting brief', prompt: 'Prepare a briefing pack for the next meeting.' },
  { id: 'draft', label: 'Draft email update', prompt: 'Draft an email update on TAMM 5.0 for stakeholders.' },
  { id: 'followup', label: 'Schedule follow-up', prompt: 'Schedule a 30-minute follow-up with Finance next week.' },
  { id: 'stakeholders', label: 'Stakeholder update', prompt: 'Draft a stakeholder update on priority decisions and timelines.' },
  { id: 'teams', label: 'Teams recap', prompt: 'Draft a Teams recap for today’s priorities and meetings.' },
  { id: 'teams-update', label: 'Teams update', prompt: 'Draft a Teams update for the executive channel on key signals.' },
  { id: 'memo', label: 'Board memo', prompt: 'Prepare a short board memo on priority decisions and risks.' },
];

const mockNews = [
  {
    id: 'news-1',
    title: 'ADDA confirmed TAMM 5.0 phase 2 readiness pending executive approval.',
    summary:
      'ADDA confirms Phase 2 readiness. Executive approval is the remaining gate; recommend confirming funding sign-off and delivery dates this week.',
  },
  {
    id: 'news-2',
    title: 'Digital Strategy 2025-2030 update draft circulated for Q1 review.',
    summary:
      'Draft strategy update is now in Q1 review. Proposed adjustments focus on service digitization KPIs and cross-entity data sharing milestones.',
  },
  {
    id: 'news-3',
    title: 'Cross-entity data sharing framework received 12/14 signatures.',
    summary:
      'Signature progress is 12/14. Remaining approvals are pending from two entities; recommend a targeted follow-up to close this week.',
  },
];

const mockSignals = [
  {
    id: 'signal-1',
    title: '2 policy updates require review in Governance.',
    draft: {
      title: 'Governance policy review required',
      channel: 'Teams',
      body: [
        'Team, two policy updates require review in the Governance queue.',
        'Please confirm owners, target review date, and any escalations.',
        'I can attach the draft policies once confirmed.',
      ].join('\n'),
      recipients: 'Governance Leadership; Policy Office',
      actionLabel: 'Send Teams update',
    },
  },
  {
    id: 'signal-2',
    title: '1 escalation awaiting executive direction.',
    draft: {
      title: 'Escalation awaiting executive direction',
      channel: 'Teams',
      body: [
        'We have one escalation awaiting executive direction.',
        'Recommendation: confirm routing and decision owner by end of day.',
        'I can draft the response once approved.',
      ].join('\n'),
      recipients: 'Executive Office; PMO Director',
      actionLabel: 'Send Teams update',
    },
  },
  {
    id: 'signal-3',
    title: 'Stakeholder sentiment trending positive this week.',
    draft: {
      title: 'Stakeholder sentiment update',
      channel: 'Teams',
      body: [
        'Sentiment is trending positive this week across key stakeholders.',
        'No immediate risks flagged; continue current engagement cadence.',
        'I can prepare a short briefing if needed.',
      ].join('\n'),
      recipients: 'Executive Staff Channel',
      actionLabel: 'Send Teams update',
    },
  },
];

const commsProfile = {
  tone: 'Formal',
  verbosity: 'Concise',
  channel: 'Email',
  approval: 'Manual confirmation required',
};

const formatShortDate = (date: string) =>
  new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

const formatDecisionLine = (decision: { title: string; level: number; dueDate: string }) =>
  `• ${decision.title} (L${decision.level}, due ${formatShortDate(decision.dueDate)})`;

const formatMeetingLine = (meeting: { time: string; title: string; location?: string }) =>
  `• ${meeting.time} ${meeting.title}${meeting.location ? ` · ${meeting.location}` : ''}`;

const getStatusSummary = (allDecisions: typeof decisions) => {
  const activeDecisions = allDecisions.filter((decision) => !decision.isPrecedent);
  const summary = activeDecisions.reduce<Record<string, number>>((acc, item) => {
    acc[item.status] = (acc[item.status] || 0) + 1;
    return acc;
  }, {});
  return [
    `• Pending review: ${summary.awaiting_review || 0}`,
    `• With Chairman: ${summary.with_chairman || 0}`,
    `• In analysis: ${summary.in_analysis || 0}`,
    `• In execution: ${summary.in_execution || 0}`,
    `• Completed: ${summary.completed || 0}`,
  ].join('\n');
};

const resolveDecisionFromText = (text: string, list: typeof decisions) => {
  const normalized = text.toLowerCase();
  const activeList = list.filter((decision) => !decision.isPrecedent);
  return activeList.find((decision) => normalized.includes(decision.title.toLowerCase())) ?? activeList[0];
};

const extractAttachments = (content: string) => {
  const match = content.match(/Attachments:\s*([^\n]+)/i);
  if (!match) return [];
  return match[1]
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
};

const formatBulletBlock = (items: string[] | undefined, fallback: string) => {
  if (!items || items.length === 0) {
    return `• ${fallback}`;
  }
  return items.map((item) => `• ${item}`).join('\n');
};

interface DraftPayload {
  title: string;
  channel?: string;
  to?: string;
  cc?: string;
  subject?: string;
  body: string;
  attachments?: string[];
  actionLabel?: string;
}

const buildScheduleSnapshot = (
  summaryDate: string,
  meetings: Array<{
    time: string;
    title: string;
    duration: number;
    location?: string;
    briefing?: { objectives: string[]; talkingPoints: string[] };
  }>
) => {
  if (meetings.length === 0) {
    return `No meetings scheduled for ${summaryDate}.`;
  }

  const meetingLines = meetings.map((meeting) => {
    const focus =
      meeting.briefing?.objectives?.[0] ??
      meeting.briefing?.talkingPoints?.[0];
    const focusLine = focus ? `\n  Prep: ${focus}` : '';
    return `• ${meeting.time} ${meeting.title} · ${meeting.duration}m${meeting.location ? ` · ${meeting.location}` : ''}${focusLine}`;
  });

  return [
    'TODAY\'S SCHEDULE',
    summaryDate,
    '',
    ...meetingLines,
    '',
    'Briefing packs are staged. Want a full meeting brief?',
  ].join('\n');
};

const buildMeetingBrief = (meeting: {
  title: string;
  time: string;
  duration: number;
  location?: string;
  briefing?: {
    objectives: string[];
    talkingPoints: string[];
    openCommitments: string[];
    recentInteractions: string[];
    suggestedQuestions: string[];
    relevantDecisions: string[];
  };
}) => {
  const briefing = meeting.briefing;

  return [
    'MEETING BRIEF',
    '',
    meeting.title,
    `${meeting.time} · ${meeting.duration}m${meeting.location ? ` · ${meeting.location}` : ''}`,
    '',
    'OBJECTIVES',
    formatBulletBlock(briefing?.objectives, 'Confirm agenda and expected outcomes.'),
    '',
    'KEY TALKING POINTS',
    formatBulletBlock(briefing?.talkingPoints, 'Share latest status updates and risks.'),
    '',
    'OPEN COMMITMENTS',
    formatBulletBlock(briefing?.openCommitments, 'No open commitments flagged.'),
    '',
    'RECENT INTERACTIONS',
    formatBulletBlock(briefing?.recentInteractions, 'No recent interactions logged.'),
    '',
    'SUGGESTED QUESTIONS',
    formatBulletBlock(briefing?.suggestedQuestions, 'Any decisions needed today?'),
    '',
    'RELATED DECISIONS',
    formatBulletBlock(briefing?.relevantDecisions, 'No linked decisions.'),
    '',
    'I can open the full briefing pack or draft your talking points.',
  ].join('\n');
};

const buildExecutiveBrief = (
  pendingDecisions: Array<{ title: string; level: number; dueDate: string }>,
  todaysMeetings: Array<{ time: string; title: string; location?: string }>
) => {
  const decisionsBlock = pendingDecisions.length
    ? pendingDecisions.slice(0, 2).map(formatDecisionLine).join('\n')
    : '• No decisions requiring attention';
  const meetingsBlock = todaysMeetings.length
    ? todaysMeetings.slice(0, 3).map(formatMeetingLine).join('\n')
    : '• No meetings scheduled';
  const newsBlock = mockNews.map((item) => `• ${item.title}`).join('\n');
  const signalsBlock = mockSignals.map((item) => `• ${item.title}`).join('\n');
  const integrationsBlock = [
    '• Email: draft + send replies',
    '• Calendar: schedule follow-ups',
    '• SharePoint: attach supporting files',
  ].join('\n');

  return [
    'EXECUTIVE BRIEF',
    '',
    'PRIORITY DECISIONS',
    decisionsBlock,
    '',
    'DECISION STATUS',
    getStatusSummary(decisions),
    '',
    'TODAY',
    meetingsBlock,
    '',
    'RELEVANT NEWS',
    newsBlock,
    '',
    'SIGNALS',
    signalsBlock,
    '',
    'INTEGRATIONS',
    integrationsBlock,
    '',
    `COMMS PROFILE: ${commsProfile.tone}, ${commsProfile.verbosity} · ${commsProfile.channel}`,
    '',
    'Ask me to draft a reply, schedule a follow-up, or attach a file.',
  ].join('\n');
};

interface ExecutiveAssistantChatProps {
  basePath?: string;
  className?: string;
  hideHeader?: boolean;
}

export function ExecutiveAssistantChat({ basePath = '/chairman', className, hideHeader }: ExecutiveAssistantChatProps) {
  const pendingDecisions = getPendingDecisionsForChairman();
  const todaysMeetings = getTodaysMeetings();
  const upcomingMeetings = getUpcomingMeetings(7);
  const executiveBrief = useMemo(
    () => buildExecutiveBrief(pendingDecisions, todaysMeetings),
    [pendingDecisions, todaysMeetings]
  );
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [actionedMessages, setActionedMessages] = useState<Record<string, string>>({});
  const [draftEdits, setDraftEdits] = useState<Record<string, DraftPayload>>({});
  const [resetKey, setResetKey] = useState(0);

  const summaryDate = useMemo(
    () =>
      new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      }),
    []
  );

  const formatValue = (value?: number) => {
    if (!value) return '—';
    if (value >= 1000000) return `AED ${(value / 1000000).toFixed(0)}M`;
    if (value >= 1000) return `AED ${(value / 1000).toFixed(0)}K`;
    return `AED ${value}`;
  };

  const pushAssistantMessage = (content: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: `${Date.now()}-assistant`,
        role: 'assistant',
        content,
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  const handleWidgetAction = (messageId: string, action: string, confirmation: string) => {
    setActionedMessages((prev) => ({ ...prev, [messageId]: action }));
    pushAssistantMessage(confirmation);
  };

  const updateDraft = (messageId: string, fallback: DraftPayload, patch: Partial<DraftPayload>) => {
    setDraftEdits((prev) => ({
      ...prev,
      [messageId]: {
        ...(prev[messageId] ?? fallback),
        ...patch,
      },
    }));
  };

  const pushAssistantWidgetMessage = (
    content: string,
    widget: AIMessage['widget'],
    meta?: AIMessage['meta']
  ) => {
    setMessages((prev) => [
      ...prev,
      {
        id: `${Date.now()}-assistant`,
        role: 'assistant',
        content,
        widget,
        meta,
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  const handleSignalClick = (signal: typeof mockSignals[number]) => {
    pushAssistantWidgetMessage(
      `Teams update drafted for: ${signal.title}`,
      'draft',
      { draft: { type: 'Teams update', ...signal.draft } }
    );
  };

  const handleNewsClick = (item: typeof mockNews[number]) => {
    pushAssistantMessage([item.title, item.summary].join('\n'));
  };

  const renderDecisionsWidget = () => (
    <div className="rounded-xl border border-border bg-background p-3 sm:p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-primary/80" />
            <p className="text-[13px] font-medium text-foreground">Priority decisions</p>
          </div>
          <p className="text-[11px] text-muted-foreground">Awaiting review</p>
        </div>
        <span className="text-[11px] text-muted-foreground">{pendingDecisions.length} items</span>
      </div>
      <div className="space-y-2">
        {pendingDecisions.slice(0, 3).map((decision) => (
          <Link
            key={decision.id}
            href={`${basePath}/decision/${decision.id}`}
            className="block rounded-lg border border-border/60 px-3 py-3 hover:bg-secondary/50 transition-colors"
          >
            <p className="text-[11px] text-muted-foreground mb-1">L{decision.level} · {decision.category}</p>
            <p className="text-[13px] font-medium text-foreground mb-2 break-words">{decision.title}</p>
            <div className="flex items-center justify-between text-[11px]">
              <p className="font-medium tabular-nums">{formatValue(decision.value)}</p>
              <p className="text-muted-foreground">Due {formatShortDate(decision.dueDate)}</p>
            </div>
          </Link>
        ))}
        {pendingDecisions.length === 0 && (
          <p className="text-[12px] text-muted-foreground">No decisions waiting.</p>
        )}
      </div>
    </div>
  );

  const renderMeetingsWidget = () => (
    <div className="rounded-xl border border-border bg-background p-3 sm:p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500/80" />
            <p className="text-[13px] font-medium text-foreground">Today&apos;s meetings</p>
          </div>
          <p className="text-[11px] text-muted-foreground">{summaryDate}</p>
        </div>
        <span className="text-[11px] text-muted-foreground">{todaysMeetings.length} events</span>
      </div>
      <div className="space-y-2">
        {todaysMeetings.slice(0, 3).map((meeting) => (
          <Link
            key={meeting.id}
            href={`${basePath}/meeting/${meeting.id}`}
            className="block rounded-lg border border-border/60 px-3 py-3 hover:bg-secondary/50 transition-colors"
          >
            <p className="text-[11px] text-muted-foreground mb-1">{meeting.time} · {meeting.duration}m</p>
            <p className="text-[13px] font-medium text-foreground mb-1 break-words">{meeting.title}</p>
            <p className="text-[11px] text-muted-foreground">{meeting.location || '—'}</p>
          </Link>
        ))}
        {todaysMeetings.length === 0 && (
          <p className="text-[12px] text-muted-foreground">No meetings scheduled.</p>
        )}
      </div>
    </div>
  );

  const renderSignalsWidget = () => (
    <div className="rounded-xl border border-border bg-background p-3 sm:p-4">
      <div className="mb-3">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-amber-500/80" />
          <p className="text-[13px] font-medium text-foreground">Signals</p>
        </div>
        <p className="text-[11px] text-muted-foreground">Requiring attention</p>
      </div>
      <div className="space-y-2 text-[12px] text-muted-foreground">
        {mockSignals.map((signal) => (
          <button
            key={signal.id}
            type="button"
            onClick={() => handleSignalClick(signal)}
            className="w-full flex items-start justify-between gap-3 rounded-lg border border-border/60 px-3 py-3 text-[12px] text-muted-foreground hover:bg-secondary/50 transition-colors text-left"
          >
            <span className="flex-1 min-w-0 break-words">{signal.title}</span>
            <ChevronRightIcon className="w-4 h-4 flex-shrink-0 text-muted-foreground mt-0.5" />
          </button>
        ))}
      </div>
    </div>
  );

  const renderNewsWidget = () => (
    <div className="rounded-xl border border-border bg-background p-3 sm:p-4">
      <div className="mb-3">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-indigo-500/80" />
          <p className="text-[13px] font-medium text-foreground">Relevant news</p>
        </div>
        <p className="text-[11px] text-muted-foreground">Latest updates</p>
      </div>
      <div className="space-y-2 text-[12px] text-muted-foreground">
        {mockNews.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => handleNewsClick(item)}
            className="w-full flex items-start justify-between gap-3 rounded-lg border border-border/60 px-3 py-3 text-[12px] text-muted-foreground hover:bg-secondary/50 transition-colors text-left"
          >
            <span className="flex-1 min-w-0 break-words">{item.title}</span>
            <ChevronRightIcon className="w-4 h-4 flex-shrink-0 text-muted-foreground mt-0.5" />
          </button>
        ))}
      </div>
    </div>
  );

  const renderApprovalWidget = (message: AIMessage) => {
    const meta = message.meta as { decisionId?: string } | undefined;
    const decision =
      decisions.find((item) => item.id === meta?.decisionId) ??
      pendingDecisions[0] ??
      decisions[0];

    if (!decision) return null;
    const action = actionedMessages[message.id];

    return (
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-[13px] font-medium">Approval required</p>
            <p className="text-[11px] text-muted-foreground">Decision ready for confirmation</p>
          </div>
          <span className="text-[11px] text-muted-foreground">L{decision.level}</span>
        </div>
        <div className="rounded-lg border border-border/70 px-3 py-2">
          <p className="text-[13px] font-medium text-foreground">{decision.title}</p>
          <p className="text-[11px] text-muted-foreground mt-1 capitalize">
            {decision.category} · Due {formatShortDate(decision.dueDate)}
          </p>
          <p className="text-[11px] text-muted-foreground mt-1">Value: {formatValue(decision.value)}</p>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <button
            className="btn-approve text-[12px] px-3 py-1.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
            disabled={action === 'approved' || action === 'rejected'}
            onClick={() =>
              handleWidgetAction(
                message.id,
                'approved',
                `Approval captured for ${decision.title}. A notification draft is ready when you want it sent.`
              )
            }
          >
            Approve
          </button>
          <button
            className="btn-reject text-[12px] px-3 py-1.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
            disabled={action === 'approved' || action === 'rejected'}
            onClick={() =>
              handleWidgetAction(
                message.id,
                'rejected',
                `Decision ${decision.title} marked for rejection. I can draft the rationale for your review.`
              )
            }
          >
            Reject
          </button>
          {action && (
            <span className={`text-[11px] font-medium ${action === 'approved' ? 'risk-text-low' : 'risk-text-critical'}`}>
              {action === 'approved' ? 'Approved' : 'Rejected'}
            </span>
          )}
        </div>
      </div>
    );
  };

  const renderEmailDraftWidget = (message: AIMessage) => {
    const meta = message.meta as
      | {
          email?: {
            to: string;
            cc?: string;
            subject: string;
            body: string;
            attachments?: string[];
          };
        }
      | undefined;
    const draft = meta?.email;
    if (!draft) return null;
    const action = actionedMessages[message.id];
    const editableDraft = (draftEdits[message.id] as DraftPayload | undefined) ?? {
      title: 'Draft email',
      to: draft.to,
      cc: draft.cc,
      subject: draft.subject,
      body: draft.body,
      attachments: draft.attachments,
    };

    return (
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-[13px] font-medium">Draft email</p>
            <p className="text-[11px] text-muted-foreground">Ready for review</p>
          </div>
          <span className="text-[10px] uppercase tracking-wide text-muted-foreground">Email</span>
        </div>
        <div className="rounded-lg border border-border/70 bg-background px-3 py-2 text-[12px] text-foreground space-y-2">
          <div>
            <label className="text-[11px] text-muted-foreground">To</label>
            <Input
              value={editableDraft.to ?? ''}
              onChange={(e) =>
                updateDraft(message.id, editableDraft, { to: e.target.value })
              }
              className="h-8 mt-1 text-[12px]"
            />
          </div>
          <div>
            <label className="text-[11px] text-muted-foreground">CC</label>
            <Input
              value={editableDraft.cc ?? ''}
              onChange={(e) =>
                updateDraft(message.id, editableDraft, { cc: e.target.value })
              }
              className="h-8 mt-1 text-[12px]"
            />
          </div>
          <div>
            <label className="text-[11px] text-muted-foreground">Subject</label>
            <Input
              value={editableDraft.subject ?? ''}
              onChange={(e) =>
                updateDraft(message.id, editableDraft, { subject: e.target.value })
              }
              className="h-8 mt-1 text-[12px]"
            />
          </div>
          <div>
            <label className="text-[11px] text-muted-foreground">Body</label>
            <Textarea
              value={editableDraft.body}
              onChange={(e) =>
                updateDraft(message.id, editableDraft, { body: e.target.value })
              }
              className="mt-1 min-h-[140px] text-[12px]"
            />
          </div>
          <div>
            <label className="text-[11px] text-muted-foreground">Attachments</label>
            <Input
              value={(editableDraft.attachments ?? []).join(', ')}
              onChange={(e) =>
                updateDraft(message.id, editableDraft, {
                  attachments: e.target.value
                    .split(',')
                    .map((item) => item.trim())
                    .filter(Boolean),
                })
              }
              className="h-8 mt-1 text-[12px]"
            />
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <Button
            size="sm"
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
            disabled={action === 'sent'}
            onClick={() =>
              handleWidgetAction(
                message.id,
                'sent',
                `Email sent to ${editableDraft.to}. I will log the delivery and any replies.`
              )
            }
          >
            {action === 'sent' ? 'Sent' : 'Send email'}
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={action === 'sent'}
            onClick={() =>
              handleWidgetAction(
                message.id,
                'saved',
                'Draft saved. Ready whenever you are.'
              )
            }
          >
            Save draft
          </Button>
        </div>
      </div>
    );
  };

  const renderDraftWidget = (message: AIMessage) => {
    const meta = message.meta as { draft?: DraftPayload } | undefined;
    const draft = meta?.draft;
    if (!draft) return null;
    const action = actionedMessages[message.id];
    const editableDraft = draftEdits[message.id] ?? draft;

    return (
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-[13px] font-medium">{editableDraft.title}</p>
            <p className="text-[11px] text-muted-foreground">Editable draft</p>
          </div>
          <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
            {editableDraft.channel ?? 'Draft'}
          </span>
        </div>
        <div className="rounded-lg border border-border/70 bg-background px-3 py-2 text-[12px] text-foreground space-y-2">
          {editableDraft.to && (
            <div>
              <label className="text-[11px] text-muted-foreground">To</label>
              <Input
                value={editableDraft.to}
                onChange={(e) => updateDraft(message.id, editableDraft, { to: e.target.value })}
                className="h-8 mt-1 text-[12px]"
              />
            </div>
          )}
          {editableDraft.cc && (
            <div>
              <label className="text-[11px] text-muted-foreground">CC</label>
              <Input
                value={editableDraft.cc}
                onChange={(e) => updateDraft(message.id, editableDraft, { cc: e.target.value })}
                className="h-8 mt-1 text-[12px]"
              />
            </div>
          )}
          {editableDraft.subject && (
            <div>
              <label className="text-[11px] text-muted-foreground">Subject</label>
              <Input
                value={editableDraft.subject}
                onChange={(e) => updateDraft(message.id, editableDraft, { subject: e.target.value })}
                className="h-8 mt-1 text-[12px]"
              />
            </div>
          )}
          <div>
            <label className="text-[11px] text-muted-foreground">Body</label>
            <Textarea
              value={editableDraft.body}
              onChange={(e) => updateDraft(message.id, editableDraft, { body: e.target.value })}
              className="mt-1 min-h-[140px] text-[12px]"
            />
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <Button
            size="sm"
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
            disabled={action === 'sent'}
            onClick={() =>
              handleWidgetAction(
                message.id,
                'sent',
                `${editableDraft.channel ?? 'Draft'} sent. I will log the delivery.`
              )
            }
          >
            {action === 'sent' ? 'Sent' : editableDraft.actionLabel ?? 'Send update'}
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={action === 'sent'}
            onClick={() =>
              handleWidgetAction(
                message.id,
                'saved',
                'Draft saved. Ready whenever you are.'
              )
            }
          >
            Save draft
          </Button>
        </div>
      </div>
    );
  };

  const renderCalendarWidget = (message: AIMessage) => {
    const meta = message.meta as
      | {
          calendar?: {
            title: string;
            date: string;
            time: string;
            duration: string;
            location: string;
            agenda?: string;
          };
        }
      | undefined;
    const calendar = meta?.calendar;
    if (!calendar) return null;
    const action = actionedMessages[message.id];

    return (
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-[13px] font-medium">Calendar invite</p>
            <p className="text-[11px] text-muted-foreground">Ready to schedule</p>
          </div>
          <span className="text-[10px] uppercase tracking-wide text-muted-foreground">Calendar</span>
        </div>
        <div className="rounded-lg border border-border/70 bg-background px-3 py-2 text-[12px] text-foreground space-y-1">
          <p className="font-medium">{calendar.title}</p>
          <p><span className="text-muted-foreground">Date:</span> {calendar.date}</p>
          <p><span className="text-muted-foreground">Time:</span> {calendar.time} · {calendar.duration}</p>
          <p><span className="text-muted-foreground">Location:</span> {calendar.location}</p>
          {calendar.agenda && (
            <p className="text-[11px] text-muted-foreground">Agenda: {calendar.agenda}</p>
          )}
        </div>
        <div className="mt-3 flex items-center gap-2">
          <Button
            size="sm"
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
            disabled={action === 'scheduled'}
            onClick={() =>
              handleWidgetAction(
                message.id,
                'scheduled',
                `Follow-up scheduled: ${calendar.title}. Calendar invite sent for confirmation.`
              )
            }
          >
            {action === 'scheduled' ? 'Scheduled' : 'Confirm schedule'}
          </Button>
          <Button size="sm" variant="outline" disabled={action === 'scheduled'}>
            Adjust time
          </Button>
        </div>
      </div>
    );
  };


  const emptyState = (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-[18px] font-semibold text-foreground">Today’s priority overview</h2>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {renderDecisionsWidget()}
        {renderMeetingsWidget()}
        {renderSignalsWidget()}
        {renderNewsWidget()}
      </div>
    </div>
  );

  const renderMessageWidget = (message: AIMessage) => {
    switch (message.widget) {
      case 'overview':
        return (
          <div className="grid gap-4 md:grid-cols-2">
            {renderDecisionsWidget()}
            {renderMeetingsWidget()}
            {renderSignalsWidget()}
            {renderNewsWidget()}
          </div>
        );
      case 'decisions':
        return renderDecisionsWidget();
      case 'meetings':
        return renderMeetingsWidget();
      case 'signals':
        return renderSignalsWidget();
      case 'news':
        return renderNewsWidget();
      case 'approval':
        return renderApprovalWidget(message);
      case 'email':
        return renderEmailDraftWidget(message);
      case 'calendar':
        return renderCalendarWidget(message);
      case 'draft':
        return renderDraftWidget(message);
      default:
        return null;
    }
  };

  const buildResponse = (content: string): {
    content: string;
    widget?: AIMessage['widget'];
    meta?: AIMessage['meta'];
  } => {
    const lower = content.toLowerCase();
    const decisionContext = resolveDecisionFromText(lower, decisions);
    const attachments = extractAttachments(content);
    const wantsScheduleToday =
      lower.includes('today') &&
      (lower.includes('schedule') || lower.includes('calendar') || lower.includes('agenda') || lower.includes('meeting'));
    const wantsMeetingBrief =
      lower.includes('meeting brief') ||
      lower.includes('briefing pack') ||
      lower.includes('briefing notes') ||
      (lower.includes('briefing') && lower.includes('meeting')) ||
      (lower.includes('prepare') && lower.includes('brief'));
    const wantsFollowUp =
      lower.includes('follow-up') ||
      lower.includes('follow up') ||
      (lower.includes('schedule') && lower.includes('next week')) ||
      lower.includes('invite');
    const nextMeeting = todaysMeetings[0] ?? upcomingMeetings[0];

    if (
      attachments.length > 0 &&
      (lower.includes('attachment') || lower.includes('file')) &&
      !lower.includes('draft') &&
      !lower.includes('send') &&
      !lower.includes('outlook') &&
      !lower.includes('email') &&
      !wantsMeetingBrief
    ) {
      return {
        content: `Attachments staged (${attachments.join(', ')}). I can include them in the next email draft or meeting brief.`,
      };
    }

    if (lower.includes('approve')) {
      if (!decisionContext) {
        return { content: 'No decision found to approve.' };
      }
      return {
        content: `Approval required for ${decisionContext.title}.`,
        widget: 'approval',
        meta: { decisionId: decisionContext.id },
      };
    }

    if (lower.includes('reject')) {
      if (!decisionContext) {
        return { content: 'No decision found to reject.' };
      }
      return {
        content: `Rejection requires confirmation for ${decisionContext.title}.`,
        widget: 'approval',
        meta: { decisionId: decisionContext.id },
      };
    }

    if (wantsMeetingBrief) {
      if (!nextMeeting) {
        return { content: 'No upcoming meetings found to brief.' };
      }
      return {
        content: buildMeetingBrief(nextMeeting),
      };
    }

    if (wantsScheduleToday) {
      const scheduleSnapshot = buildScheduleSnapshot(summaryDate, todaysMeetings);
      return {
        content: scheduleSnapshot,
        widget: todaysMeetings.length > 0 ? 'meetings' : undefined,
      };
    }

    if (wantsFollowUp) {
      const calendarInvite = {
        title: 'Finance coordination follow-up',
        date: 'Next Tuesday',
        time: '10:30 AM',
        duration: '30 min',
        location: 'Microsoft Teams',
        agenda: 'Shared services cost model, TAMM 5.0 funding alignment',
      };
      return {
        content: 'Follow-up ready to schedule.',
        widget: 'calendar',
        meta: { calendar: calendarInvite },
      };
    }

    if (lower.includes('slack') || lower.includes('teams') || lower.includes('channel update')) {
      const channelName = 'Teams';
      const signalLine = mockSignals[0]?.title ?? 'No new signals flagged.';
      const draft: DraftPayload = {
        title: `${channelName} update`,
        channel: channelName,
        body: [
          `• ${signalLine}`,
          '• Priority decisions are staged for review.',
          '• Meetings and briefings are ready for today.',
        ].join('\n'),
        actionLabel: `Send ${channelName} update`,
      };
      return {
        content: `${channelName} update draft ready.`,
        widget: 'draft',
        meta: { draft },
      };
    }

    if (lower.includes('stakeholder') && (lower.includes('update') || lower.includes('brief'))) {
      const draft: DraftPayload = {
        title: 'Stakeholder update',
        channel: 'Stakeholder email',
        to: 'Stakeholder distribution list',
        subject: 'Priority decisions and delivery timeline update',
        body: [
          'Good afternoon,',
          '',
          'Here is the latest summary on priority decisions:',
          ...pendingDecisions.slice(0, 2).map((decision) => `• ${decision.title} (L${decision.level})`),
          '• Next steps: confirm execution owners and delivery timelines.',
          '',
          'Respectfully,',
          "Chairman’s Office",
        ].join('\n'),
        actionLabel: 'Send update',
      };
      return {
        content: 'Stakeholder update draft ready.',
        widget: 'draft',
        meta: { draft },
      };
    }

    if (lower.includes('memo') || lower.includes('board')) {
      const memoLines = pendingDecisions.slice(0, 2).map((decision) => `• ${decision.title} (L${decision.level})`);
      const draft: DraftPayload = {
        title: 'Board memo',
        channel: 'Board memo',
        subject: 'Board memo: priority decisions and risks',
        body: [
          'Highlights:',
          ...memoLines,
          '• Risks: funding alignment, cross-entity data governance.',
          '• Actions requested: approve top decision, confirm execution owner.',
        ].join('\n'),
        actionLabel: 'Send memo',
      };
      return {
        content: 'Board memo draft ready.',
        widget: 'draft',
        meta: { draft },
      };
    }

    if (lower.includes('outlook') || lower.includes('email') || lower.includes('send') || lower.includes('draft') || lower.includes('message')) {
      const recipients = decisionContext?.title.includes('TAMM')
        ? 'ADDA Director General; PMO Director; Department of Finance'
        : 'Executive Council Secretariat; PMO Director; Strategy Office';
      const ccLine = 'Chief of Staff; Digital Strategy Office';
      const subject = decisionContext
        ? `Update on ${decisionContext.title}`
        : 'Chairman update: priority decisions and next steps';
      const attachmentList = attachments.length > 0 ? attachments : ['Briefing pack', 'Decision memo'];
      const summaryLines = decisionContext
        ? [
            `Decision: ${decisionContext.title} (L${decisionContext.level})`,
            `Recommendation: ${decisionContext.aiRecommendation?.toUpperCase() ?? 'Review'}`,
            `Due date: ${formatShortDate(decisionContext.dueDate)}`,
            'Request: confirm implementation timeline and risk mitigation plan by end of week.',
          ]
        : [
            "Summary of today's priority decisions and next steps.",
            'Request: confirmation of owners and delivery timelines.',
            'Please flag any escalations before Thursday.',
          ];
      const emailDraft = {
        to: recipients,
        cc: ccLine,
        subject,
        body: [
          'Good afternoon,',
          '',
          ...summaryLines.map((line) => `- ${line}`),
          '',
          'Respectfully,',
          'Chairman\'s Office',
        ].join('\n'),
        attachments: attachmentList,
      };

      return {
        content: 'Email draft ready for your review.',
        widget: 'email',
        meta: { email: emailDraft, tone: commsProfile.tone, verbosity: commsProfile.verbosity },
      };
    }

    if (lower.includes('status') && lower.includes('decision')) {
      return {
        content: 'Decision status at a glance.',
        widget: 'decisions',
      };
    }

    if (lower.includes('full brief') || lower.includes('text brief')) {
      return { content: executiveBrief };
    }

    if (lower.includes('brief') || lower.includes('summary') || lower.includes('executive')) {
      return {
        content: 'Here is the briefing snapshot.',
        widget: 'overview',
      };
    }

    if (lower.includes('news') || lower.includes('signal')) {
      return {
        content: 'Latest signals and news.',
        widget: lower.includes('news') ? 'news' : 'signals',
      };
    }

    if (lower.includes('schedule') || lower.includes('meeting') || lower.includes('calendar')) {
      if (todaysMeetings.length === 0) {
        return { content: 'No meetings scheduled for today.' };
      }
      return {
        content: `Today you have ${todaysMeetings.length} meetings.`,
        widget: 'meetings',
      };
    }

    if (lower.includes('decision') || lower.includes('approve') || lower.includes('review')) {
      if (pendingDecisions.length === 0) {
        return { content: 'No decisions require your attention right now.' };
      }
      return {
        content: 'Decisions that need attention are ready to review.',
        widget: 'decisions',
      };
    }

    return {
      content: 'Understood. I can prepare a brief, draft an email, schedule a follow-up, or attach files.',
    };
  };

  const handleSendMessage = (content: string) => {
    const userMessage: AIMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    const response = buildResponse(content);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-ai`,
          role: 'assistant',
          content: response.content,
          widget: response.widget,
          meta: response.meta,
          timestamp: new Date().toISOString(),
        },
      ]);
      setIsLoading(false);
    }, 900);
  };

  const handleToggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      handleSendMessage('Voice note: Give me the one-minute brief.');
      return;
    }
    setIsRecording(true);
  };

  const clearChat = () => {
    setMessages([]);
    setActionedMessages({});
    setDraftEdits({});
    setIsLoading(false);
    setIsRecording(false);
    setResetKey((prev) => prev + 1);
  };

  return (
    <div className={className ? `flex flex-col h-full ${className}` : 'flex flex-col h-full'}>
      {!hideHeader && (
        <div className="flex items-center justify-end pb-3">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={clearChat}
            disabled={messages.length === 0 && !isLoading}
          >
            Clear chat
          </Button>
        </div>
      )}
      <AIChat
        key={resetKey}
        messages={messages}
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
      placeholder="Ask for a brief, draft an email, or schedule a follow-up..."
        className="flex-1"
        quickPrompts={quickPrompts}
        showVoice
        isRecording={isRecording}
        onToggleRecording={handleToggleRecording}
        enableAttachments
        emptyState={emptyState}
        renderMessageWidget={renderMessageWidget}
      />
    </div>
  );
}
