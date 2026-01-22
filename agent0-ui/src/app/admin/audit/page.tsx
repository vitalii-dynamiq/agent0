'use client';

import { useState, useMemo } from 'react';
import { auditEntries, getAuditByDecision, decisions } from '@/lib/mock-data';
import { AuditAction } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AuthorityBarometerCard } from '@/components/shared/authority-barometer';
import { DecisionRouteCard } from '@/components/shared/decision-route-card';
import { DecisionTriageCard } from '@/components/shared/decision-triage-card';
import { DecisionExecutionCard } from '@/components/shared/decision-execution-card';
import { DecisionOutcomeCard } from '@/components/shared/decision-outcome-card';
import { cn } from '@/lib/utils';
import { 
  MagnifyingGlassIcon,
  FileTextIcon,
  PersonIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CheckIcon,
  Cross2Icon,
  ExclamationTriangleIcon,
  LightningBoltIcon,
  Link2Icon,
  LockClosedIcon,
  DownloadIcon,
  TokensIcon
} from '@radix-ui/react-icons';

const actionConfig: Record<AuditAction, { 
  icon: React.ElementType; 
  label: string; 
}> = {
  decision_created: { icon: FileTextIcon, label: 'Decision Created' },
  context_retrieved: { icon: MagnifyingGlassIcon, label: 'Context Retrieved' },
  precedents_matched: { icon: Link2Icon, label: 'Precedents Matched' },
  risk_assessed: { icon: ExclamationTriangleIcon, label: 'Risk Assessed' },
  recommendation_generated: { icon: LightningBoltIcon, label: 'AI Recommendation' },
  human_review_started: { icon: PersonIcon, label: 'Human Review' },
  decision_approved: { icon: CheckIcon, label: 'Approved' },
  decision_rejected: { icon: Cross2Icon, label: 'Rejected' },
  decision_escalated: { icon: ChevronUpIcon, label: 'Escalated' },
  feedback_submitted: { icon: CheckIcon, label: 'Feedback Submitted' },
  policy_applied: { icon: LockClosedIcon, label: 'Policy Applied' },
};

export default function AuditPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const initialDecisionId = auditEntries[0]?.decisionId ?? decisions[0]?.id ?? null;
  const [selectedDecisionId, setSelectedDecisionId] = useState<string | null>(initialDecisionId);
  const [actorFilter, setActorFilter] = useState<'all' | 'ai' | 'human'>('all');
  const [expandedEntries, setExpandedEntries] = useState<Set<string>>(new Set());

  const decisionsWithAudit = useMemo(() => {
    const decisionIds = [...new Set(auditEntries.map(a => a.decisionId))];
    return decisions.filter(d => decisionIds.includes(d.id) && !d.isPrecedent);
  }, []);

  const activeDecisionId = useMemo(() => {
    if (selectedDecisionId && decisionsWithAudit.some((d) => d.id === selectedDecisionId)) {
      return selectedDecisionId;
    }
    return decisionsWithAudit[0]?.id ?? null;
  }, [selectedDecisionId, decisionsWithAudit]);

  const selectedAudit = useMemo(() => {
    if (!activeDecisionId) return [];
    let entries = getAuditByDecision(activeDecisionId);
    
    if (actorFilter !== 'all') {
      entries = entries.filter(e => e.actor === actorFilter);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      entries = entries.filter(e => 
        e.action.toLowerCase().includes(query) ||
        e.details.reasoning?.toLowerCase().includes(query) ||
        e.actorName?.toLowerCase().includes(query)
      );
    }
    
    return entries;
  }, [activeDecisionId, actorFilter, searchQuery]);

  const decisionAuditEntries = useMemo(() => {
    if (!activeDecisionId) return [];
    return getAuditByDecision(activeDecisionId);
  }, [activeDecisionId]);

  const contextEntry = useMemo(
    () => decisionAuditEntries.find((entry) => entry.action === 'context_retrieved'),
    [decisionAuditEntries]
  );
  const precedentsEntry = useMemo(
    () => decisionAuditEntries.find((entry) => entry.action === 'precedents_matched'),
    [decisionAuditEntries]
  );
  const recommendationEntry = useMemo(
    () => decisionAuditEntries.find((entry) => entry.action === 'recommendation_generated'),
    [decisionAuditEntries]
  );
  const overrideEntry = useMemo(
    () =>
      decisionAuditEntries.find(
        (entry) =>
          entry.action === 'feedback_submitted' &&
          entry.details.previousValue !== undefined &&
          entry.details.newValue !== undefined
      ),
    [decisionAuditEntries]
  );

  const stats = useMemo(() => {
    const total = auditEntries.length;
    const aiActions = auditEntries.filter(e => e.actor === 'ai').length;
    const humanActions = auditEntries.filter(e => e.actor === 'human').length;
    const confidenceEntries = auditEntries.filter(e => typeof e.details.confidence === 'number');
    const avgConfidence = confidenceEntries.length
      ? confidenceEntries.reduce((acc, e) => acc + (e.details.confidence || 0), 0) / confidenceEntries.length
      : 0;
    
    return { total, aiActions, humanActions, avgConfidence: Math.round(avgConfidence) };
  }, []);

  const toggleExpanded = (id: string) => {
    setExpandedEntries(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const selectedDecision = decisions.find(d => d.id === activeDecisionId);

  const discussionThread = [
    {
      id: 'msg-1',
      actor: 'Chief of Staff',
      message: 'Need confirmation on revised delivery timeline and risk mitigation plan.',
      timestamp: 'Jan 10 · 10:04 AM',
    },
    {
      id: 'msg-2',
      actor: 'Agent-0',
      message: 'Pulled latest timeline from Teams notes and Oracle funding readiness.',
      timestamp: 'Jan 10 · 10:07 AM',
    },
    {
      id: 'msg-3',
      actor: 'Chairman',
      message: 'Proceed with phased approval; request the updated plan before release.',
      timestamp: 'Jan 10 · 10:12 AM',
    },
  ];

  const parseSource = (item: string) => {
    const [source, rest] = item.split('•').map((part) => part.trim());
    if (!rest) {
      return { source: 'Source', detail: item };
    }
    return { source, detail: rest };
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      {/* Header */}
      <div className="px-6 py-5 border-b border-border">
        <div className="flex items-start justify-between">
          <p className="text-[14px] text-muted-foreground">
            Complete transparency into AI reasoning and decision-making
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 text-[13px]">
              <DownloadIcon className="w-3.5 h-3.5 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-10 mt-6">
          <div>
            <p className="text-2xl font-semibold tabular-nums">{stats.total}</p>
            <p className="text-[12px] text-muted-foreground">Total Actions</p>
          </div>
          <div>
            <p className="text-2xl font-semibold tabular-nums">{stats.aiActions}</p>
            <p className="text-[12px] text-muted-foreground">AI Actions</p>
          </div>
          <div>
            <p className="text-2xl font-semibold tabular-nums">{stats.humanActions}</p>
            <p className="text-[12px] text-muted-foreground">Human Actions</p>
          </div>
          <div>
            <p className="text-2xl font-semibold tabular-nums">{stats.avgConfidence}%</p>
            <p className="text-[12px] text-muted-foreground">Avg Confidence</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Decision List Sidebar */}
        <div className="w-72 border-r border-border flex flex-col overflow-hidden min-h-0">
          <div className="p-4 border-b border-border">
            <p className="text-[13px] font-medium text-muted-foreground mb-3">Audited Decisions</p>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search decisions..." className="pl-9 h-9 text-[13px]" />
            </div>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
              {decisionsWithAudit.length === 0 && (
                <div className="p-4 text-[12px] text-muted-foreground">
                  No audited decisions available yet.
                </div>
              )}
              {decisionsWithAudit.map(decision => {
                const entryCount = auditEntries.filter(a => a.decisionId === decision.id).length;
                return (
                  <Button
                    key={decision.id}
                    type="button"
                    variant="ghost"
                    onClick={() => setSelectedDecisionId(decision.id)}
                    className={cn(
                      "w-full h-auto text-left p-3 rounded-lg transition-colors justify-start items-start",
                      activeDecisionId === decision.id ? "bg-secondary" : "hover:bg-secondary/50"
                    )}
                  >
                    <div className="flex items-start justify-between gap-3 w-full">
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-medium truncate">{decision.title}</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          L{decision.level} · {decision.category}
                        </p>
                      </div>
                      <span className="text-[11px] text-muted-foreground tabular-nums mt-0.5">{entryCount}</span>
                    </div>
                  </Button>
                );
              })}
            </div>
          </ScrollArea>
        </div>

        {/* Audit Timeline */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {selectedDecision ? (
            <>
              {/* Decision Header */}
              <div className="p-4 border-b border-border">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] text-muted-foreground">Level {selectedDecision.level}</span>
                      <span className="text-[11px] text-muted-foreground">·</span>
                      <span className="text-[11px] text-muted-foreground capitalize">{selectedDecision.status.replace('_', ' ')}</span>
                    </div>
                    <h2 className="text-[15px] font-medium">{selectedDecision.title}</h2>
                  </div>
                  {selectedDecision.value && (
                    <p className="text-[14px] font-medium tabular-nums flex-shrink-0">
                      AED {(selectedDecision.value / 1000000).toFixed(0)}M
                    </p>
                  )}
                </div>

                {/* Filters */}
                <div className="flex items-center gap-3 mt-4">
                  <div className="relative flex-1 max-w-xs">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search audit entries..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 h-9 text-[13px]"
                    />
                  </div>
                  <div className="flex items-center gap-1 p-1 bg-secondary rounded-lg">
                    {(['all', 'ai', 'human'] as const).map(filter => (
                      <Button
                        key={filter}
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setActorFilter(filter)}
                        className={cn(
                          "px-3 py-1.5 text-[12px] font-medium rounded-md transition-colors",
                          actorFilter === filter
                            ? "bg-foreground text-background hover:bg-foreground"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {filter === 'all' ? 'All' : filter === 'ai' ? 'AI' : 'Human'}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="flex-1 min-h-0 overflow-y-auto">
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
                    <div className="rounded-lg border border-border bg-card p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-[13px] font-medium">Context sources</h3>
                        <span className="text-[11px] text-muted-foreground">
                          {contextEntry?.details.contextRetrieved?.length || 0}
                        </span>
                      </div>
                      <div className="space-y-2">
                        {(contextEntry?.details.contextRetrieved || []).map((item, idx) => {
                          const parsed = parseSource(item);
                          return (
                            <div key={`${parsed.source}-${idx}`} className="rounded-lg border border-border/70 px-3 py-2">
                              <p className="text-[10px] uppercase text-muted-foreground tracking-wide">{parsed.source}</p>
                              <p className="text-[12px] text-foreground">{parsed.detail}</p>
                            </div>
                          );
                        })}
                        {!contextEntry && (
                          <p className="text-[12px] text-muted-foreground">Context sources will appear once retrieved.</p>
                        )}
                      </div>
                    </div>

                    <div className="rounded-lg border border-border bg-card p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-[13px] font-medium">AI reasoning & precedents</h3>
                        <span className="text-[11px] text-muted-foreground">
                          {precedentsEntry?.details.precedentsMatched?.length || 0} precedents
                        </span>
                      </div>
                      <div className="space-y-3 text-[12px] text-muted-foreground">
                        <p className="text-foreground">
                          {recommendationEntry?.details.reasoning || 'AI reasoning will be available after analysis.'}
                        </p>
                        <div className="space-y-2">
                          {(precedentsEntry?.details.precedentsMatched || []).map((prec) => (
                            <div key={prec.id} className="flex items-center justify-between rounded-lg border border-border/70 px-3 py-2">
                              <span className="text-foreground">{prec.title}</span>
                              <span className="text-[11px] text-muted-foreground tabular-nums">{prec.similarity}%</span>
                            </div>
                          ))}
                          {(!precedentsEntry || (precedentsEntry.details.precedentsMatched || []).length === 0) && (
                            <p className="text-[12px] text-muted-foreground">No precedents surfaced yet.</p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="rounded-lg border border-border bg-card p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-[13px] font-medium">Override reasoning</h3>
                        <span className="text-[11px] text-muted-foreground">Human feedback</span>
                      </div>
                      {overrideEntry ? (
                        <div className="space-y-3 text-[12px] text-muted-foreground">
                          <div className="flex items-center justify-between rounded-lg border border-border/70 px-3 py-2">
                            <span>AI recommendation</span>
                            <span className="text-foreground font-medium">{String(overrideEntry.details.previousValue)}</span>
                          </div>
                          <div className="flex items-center justify-between rounded-lg border border-border/70 px-3 py-2">
                            <span>Final decision</span>
                            <span className="text-foreground font-medium">{String(overrideEntry.details.newValue)}</span>
                          </div>
                          <p className="text-foreground">
                            {overrideEntry.details.reasoning || 'Override rationale captured.'}
                          </p>
                          <p className="text-[11px] text-muted-foreground">
                            by {overrideEntry.actorName || 'Human reviewer'}
                          </p>
                        </div>
                      ) : (
                        <p className="text-[12px] text-muted-foreground">
                          No overrides recorded for this decision.
                        </p>
                      )}
                    </div>
                    <AuthorityBarometerCard
                      authority={selectedDecision.authorityBarometer}
                      variant="detail"
                    />
                  </div>

                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <DecisionRouteCard steps={selectedDecision.route} />
                      {selectedDecision.escalationReason && (
                        <div className="rounded-lg border border-border bg-secondary/40 p-3">
                          <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                            Escalation reason
                          </p>
                          <p className="text-[12px] text-foreground mt-1">
                            {selectedDecision.escalationReason}
                          </p>
                        </div>
                      )}
                    </div>
                    <DecisionTriageCard triage={selectedDecision.triage} />
                    <DecisionExecutionCard execution={selectedDecision.execution} />
                    <DecisionOutcomeCard outcome={selectedDecision.outcome} />
                  </div>

                  <div className="rounded-lg border border-border bg-card p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-[13px] font-medium">Decision discussion</h3>
                      <span className="text-[11px] text-muted-foreground">Internal thread</span>
                    </div>
                    <div className="space-y-3">
                      {discussionThread.map((msg) => (
                        <div key={msg.id} className="rounded-lg border border-border/70 px-3 py-2">
                          <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                            <span>{msg.actor}</span>
                            <span>{msg.timestamp}</span>
                          </div>
                          <p className="text-[12px] text-foreground mt-1">{msg.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-5 top-0 bottom-0 w-px bg-border" />

                    {/* Entries */}
                    <div className="space-y-4">
                      {selectedAudit.map((entry) => {
                        const config = actionConfig[entry.action];
                        const Icon = config.icon;
                        const isExpanded = expandedEntries.has(entry.id);
                        
                        return (
                          <div key={entry.id} className="relative pl-12">
                            {/* Timeline dot */}
                            <div className="absolute left-3 w-5 h-5 rounded-full bg-secondary border border-border flex items-center justify-center">
                              <Icon className="w-3 h-3 text-muted-foreground" />
                            </div>

                            {/* Entry Card */}
                            <div className={cn(
                              "border border-border rounded-lg p-4 transition-colors",
                              isExpanded && "bg-secondary/30"
                            )}>
                              <div 
                                className="flex items-start justify-between cursor-pointer"
                                onClick={() => toggleExpanded(entry.id)}
                              >
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-[13px] font-medium">{config.label}</span>
                                    <span className="text-[11px] text-muted-foreground">
                                      {entry.actor === 'ai' ? 'AI Agent' : entry.actorName || 'Human'}
                                    </span>
                                    {typeof entry.details.confidence === 'number' && (
                                      <span className="text-[11px] text-muted-foreground tabular-nums">
                                        {entry.details.confidence}%
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-[12px] text-muted-foreground">
                                    {new Date(entry.timestamp).toLocaleString('en-AE', {
                                      month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
                                    })}
                                  </p>
                                </div>
                                <Button type="button" variant="ghost" size="icon-sm" className="p-1">
                                  {isExpanded ? (
                                    <ChevronUpIcon className="w-4 h-4 text-muted-foreground" />
                                  ) : (
                                    <ChevronDownIcon className="w-4 h-4 text-muted-foreground" />
                                  )}
                                </Button>
                              </div>

                              {/* Expanded Details */}
                              {isExpanded && (
                                <div className="mt-4 pt-4 border-t border-border space-y-4">
                                  {entry.details.reasoning && (
                                    <div>
                                      <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide mb-2">
                                        {entry.actor === 'ai' ? 'AI Reasoning' : 'Notes'}
                                      </p>
                                      <p className="text-[13px] text-foreground bg-secondary p-3 rounded-lg">
                                        {entry.details.reasoning}
                                      </p>
                                    </div>
                                  )}

                                  {entry.details.contextRetrieved && entry.details.contextRetrieved.length > 0 && (
                                    <div>
                                      <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide mb-2">
                                        Context ({entry.details.contextRetrieved.length})
                                      </p>
                                      <div className="space-y-1">
                                        {entry.details.contextRetrieved.map((ctx, i) => (
                                          <div key={i} className="flex items-center gap-2 text-[13px] p-2 bg-secondary rounded-lg">
                                            <MagnifyingGlassIcon className="w-3.5 h-3.5 text-muted-foreground" />
                                            {ctx}
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {entry.details.precedentsMatched && entry.details.precedentsMatched.length > 0 && (
                                    <div>
                                      <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide mb-2">
                                        Precedents
                                      </p>
                                      <div className="space-y-1">
                                        {entry.details.precedentsMatched.map((prec, i) => (
                                          <div key={i} className="flex items-center justify-between p-2 bg-secondary rounded-lg">
                                            <div className="flex items-center gap-2">
                                              <Link2Icon className="w-3.5 h-3.5 text-muted-foreground" />
                                              <span className="text-[13px]">{prec.title}</span>
                                            </div>
                                            <span className="text-[11px] text-muted-foreground tabular-nums">
                                              {prec.similarity}%
                                            </span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {entry.details.riskFactors && entry.details.riskFactors.length > 0 && (
                                    <div>
                                      <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide mb-2">
                                        Risk Factors
                                      </p>
                                      <div className="space-y-1">
                                        {entry.details.riskFactors.map((risk, i) => (
                                          <div key={i} className="flex items-start gap-2 text-[13px] p-2 bg-secondary rounded-lg">
                                            <ExclamationTriangleIcon className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0 mt-0.5" />
                                            {risk}
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {entry.details.policyApplied && (
                                    <div>
                                      <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide mb-2">
                                        Policy Applied
                                      </p>
                                      <div className="flex items-center gap-2 p-2 bg-secondary rounded-lg">
                                        <LockClosedIcon className="w-3.5 h-3.5 text-muted-foreground" />
                                        <span className="text-[13px]">{entry.details.policyApplied}</span>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                      {selectedAudit.length === 0 && (
                        <div className="text-[12px] text-muted-foreground">
                          No audit entries match the current filters.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <TokensIcon className="w-10 h-10 mx-auto mb-4 opacity-30" />
                <p className="text-[13px]">Select a decision to view its audit trail</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
