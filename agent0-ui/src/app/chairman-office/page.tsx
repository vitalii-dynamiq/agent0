'use client';

import { useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { decisions, getPendingDecisionsForChairman, getTodaysMeetings } from '@/lib/mock-data';
import { ExternalLinkIcon, BellIcon } from '@radix-ui/react-icons';

// Structured news data with full content
const newsItems = [
  {
    id: 'news-1',
    title: 'Digital Strategy 2025-2030 Update',
    summary: 'Draft circulated for Q1 review',
    source: 'Strategy Office',
    date: '2 hours ago',
    content: `The Digital Strategy 2025-2030 draft has been circulated to all entity heads for Q1 review. Key highlights include:

• Unified digital identity framework across all government services
• AI-first approach for citizen services with 80% automation target
• Cross-entity data lake consolidation by 2027
• Investment of AED 2.4B over 5 years

The draft requires feedback by January 31st. Three working sessions have been scheduled with IT leads from each major entity. The strategy aligns with UAE Centennial 2071 vision and builds on TAMM platform success.

Stakeholder alignment is at 78% with remaining concerns around data sovereignty and legacy system migration timelines.`,
  },
  {
    id: 'news-2',
    title: 'Cross-Entity Data Sharing Framework',
    summary: 'Received 12/14 signatures',
    source: 'ADDA',
    date: '4 hours ago',
    content: `The Cross-Entity Data Sharing Framework has achieved significant progress with 12 out of 14 required entity signatures now secured.

Pending signatures:
• Department of Economic Development (expected by Jan 25)
• Department of Health (legal review in progress)

Framework highlights:
• Establishes unified data governance standards
• Defines 47 shared data categories
• Creates automated consent management
• Implements privacy-by-design principles

Once fully signed, the framework enables real-time data exchange between entities, reducing citizen touchpoints by an estimated 40% for common services.`,
  },
  {
    id: 'news-3',
    title: 'TAMM 5.0 Phase 2 Readiness',
    summary: 'Pending executive approval',
    source: 'TAMM PMO',
    date: '6 hours ago',
    content: `ADDA has confirmed technical readiness for TAMM 5.0 Phase 2 deployment. The phase introduces:

• 127 new digital services across 8 entities
• Unified business licensing portal
• Predictive service recommendations
• Multi-language voice assistant integration

Technical validation complete:
✓ Load testing (500K concurrent users)
✓ Security audit (0 critical findings)
✓ Accessibility compliance (WCAG 2.1 AA)
✓ Integration testing with 23 backend systems

Executive approval is required to proceed with public launch scheduled for March 1st. Budget allocation of AED 45M has been pre-approved pending final sign-off.`,
  },
];

// Structured signals data
const signalItems = [
  {
    id: 'signal-1',
    title: 'Data Sharing Framework Escalation',
    summary: 'Awaiting Chairman direction',
    priority: 'high' as const,
    category: 'Governance',
    content: `The remaining 2 entities have raised concerns requiring Chairman-level direction:

DoED concern: Commercial data classification conflicts with federal guidelines. Legal team recommends Chairman-to-Minister communication.

DoH concern: Patient data provisions require additional safeguards beyond framework scope. Proposed amendment adds 3-week delay.

Recommended action: Schedule 30-min alignment call with both entity heads this week.`,
  },
  {
    id: 'signal-2',
    title: 'Procurement Authority Threshold',
    summary: 'Policy revision in review',
    priority: 'medium' as const,
    category: 'Policy',
    content: `The procurement authority threshold revision is under review following audit recommendations.

Proposed changes:
• Increase L1 threshold from AED 500K to AED 750K
• Introduce expedited approval track for pre-qualified vendors
• Reduce approval stages from 5 to 3 for routine procurement

Impact: Expected to reduce average procurement cycle by 12 days.

Status: Finance Committee review scheduled for next Thursday. Your input on threshold levels requested.`,
  },
  {
    id: 'signal-3',
    title: 'Stakeholder Sentiment Analysis',
    summary: 'Trending positive this week',
    priority: 'low' as const,
    category: 'Intelligence',
    content: `Weekly stakeholder sentiment analysis shows positive trend:

Overall sentiment: +12% vs last week
• Entity heads: 85% positive (up from 78%)
• Technical teams: 72% positive (stable)
• External partners: 68% positive (up from 61%)

Key drivers:
• TAMM 5.0 preview received well
• Budget allocation process improvements noted
• Cross-entity collaboration praised in 3 public forums

Areas to monitor:
• Timeline concerns around Q2 deliverables
• Resource allocation for AI initiatives`,
  },
];

export default function ChairmanDashboard() {
  const pendingDecisions = getPendingDecisionsForChairman();
  const todaysMeetings = getTodaysMeetings();

  const autoApprovedDecisions = decisions
    .filter((decision) => !decision.isPrecedent && decision.status === 'completed')
    .slice(0, 3);

  const [selectedNews, setSelectedNews] = useState<typeof newsItems[0] | null>(null);
  const [selectedSignal, setSelectedSignal] = useState<typeof signalItems[0] | null>(null);
  const [actionTaken, setActionTaken] = useState<string | null>(null);

  const handleSignalAction = (signal: typeof signalItems[0]) => {
    // Simulate taking action on a signal
    setActionTaken(`Action initiated for "${signal.title}". Teams notification sent to relevant stakeholders.`);
    setSelectedSignal(null);
    // Clear the notification after 4 seconds
    setTimeout(() => setActionTaken(null), 4000);
  };

  const formatValue = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(0)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
    return `${value}`;
  };

  // Mocked user name - would come from auth context in production
  const userName = 'H.E. Mohamed';

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return `Good morning, ${userName}`;
    if (hour < 17) return `Good afternoon, ${userName}`;
    return `Good evening, ${userName}`;
  };

  return (
    <div className="min-h-[calc(100vh-56px)] bg-background">
      <div className="max-w-5xl mx-auto px-6 pt-12 pb-10">
        <div className="flex items-center justify-between mb-2">
          <p className="text-caption">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <h1 className="text-headline">{getGreeting()}</h1>

        <div className="flex gap-12 mt-10 pt-6 border-t border-border">
          <div>
            <p className="text-2xl font-medium tabular-nums text-primary">{pendingDecisions.length}</p>
            <p className="text-[12px] text-muted-foreground mt-1">Pending</p>
          </div>
          <div>
            <p className="text-2xl font-medium tabular-nums text-success">{autoApprovedDecisions.length}</p>
            <p className="text-[12px] text-muted-foreground mt-1">Auto-approved</p>
          </div>
          <div>
            <p className="text-2xl font-medium tabular-nums">{todaysMeetings.length}</p>
            <p className="text-[12px] text-muted-foreground mt-1">Meetings</p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 pb-16 space-y-12">
        <div className="grid grid-cols-5 gap-12">
          <div className="col-span-3 space-y-12">
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-title">Requires decision</h2>
                <Link href="/chairman-office/decisions" className="link-arrow">
                  View all
                  <svg width="14" height="14" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"/>
                  </svg>
                </Link>
              </div>

              <div className="space-y-2">
                {pendingDecisions.slice(0, 3).map((decision) => (
                  <Link 
                    key={decision.id}
                    href={`/chairman-office/decision/${decision.id}`}
                    className="block"
                  >
                    <div className="p-4 border border-border rounded-xl transition-all duration-200 card-glow">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 text-[11px] text-muted-foreground mb-1.5">
                            <span>L{decision.level}</span>
                            <span>·</span>
                            <span>{decision.category}</span>
                          </div>
                          <h3 className="text-[14px] font-medium text-foreground truncate">
                            {decision.title}
                          </h3>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-[14px] font-medium tabular-nums">
                            {decision.value ? `AED ${formatValue(decision.value)}` : '—'}
                          </p>
                          <p className="text-[11px] text-muted-foreground mt-0.5">
                            Due {new Date(decision.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-title">Auto-approved today</h2>
                <Link href="/admin/audit" className="link-arrow">
                  Audit log
                  <svg width="14" height="14" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"/>
                  </svg>
                </Link>
              </div>

              <div className="space-y-2">
                {autoApprovedDecisions.map((decision) => (
                  <Link
                    key={decision.id}
                    href={`/chairman-office/decision/${decision.id}`}
                    className="block"
                  >
                    <div className="p-4 border border-border rounded-xl transition-all duration-200 card-glow">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 text-[11px] text-muted-foreground mb-1.5">
                            <span className="text-success">✓ Auto-approved</span>
                            <span>·</span>
                            <span>{decision.aiConfidence ?? '—'}% confidence</span>
                          </div>
                          <h3 className="text-[14px] font-medium text-foreground truncate">
                            {decision.title}
                          </h3>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-[14px] font-medium tabular-nums">
                            {decision.value ? `AED ${formatValue(decision.value)}` : '—'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </div>

          <div className="col-span-2 space-y-10">
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-title">Meetings today</h2>
                <Link href="/chairman-office/meetings" className="link-arrow">
                  All meetings
                  <svg width="14" height="14" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"/>
                  </svg>
                </Link>
              </div>

              <div className="space-y-2">
                {todaysMeetings.slice(0, 3).map((meeting) => (
                  <Link 
                    key={meeting.id}
                    href={`/chairman-office/meeting/${meeting.id}`}
                    className="block"
                  >
                    <div className="p-4 border border-border rounded-xl transition-all duration-200 card-glow">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 text-[11px] text-muted-foreground mb-1.5">
                            <span className="font-medium tabular-nums">{meeting.time}</span>
                            <span>·</span>
                            <span>{meeting.duration}m</span>
                          </div>
                          <h3 className="text-[14px] font-medium text-foreground truncate">
                            {meeting.title}
                          </h3>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-[11px] text-muted-foreground">{meeting.location || '—'}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {/* Signals Section */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-title">Priority signals</h2>
                <span className="text-[11px] text-muted-foreground">{signalItems.length} active</span>
              </div>
              <div className="space-y-2">
                {signalItems.map((signal) => (
                  <button
                    key={signal.id}
                    type="button"
                    onClick={() => setSelectedSignal(signal)}
                    className="w-full text-left p-4 border border-border rounded-xl transition-all duration-200 card-glow"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 text-[11px] text-muted-foreground mb-1.5">
                          <span className={cn(
                            "flex items-center gap-1.5",
                            signal.priority === 'high' ? "text-destructive" :
                            signal.priority === 'medium' ? "text-amber-600 dark:text-amber-400" : "text-success"
                          )}>
                            <span className={cn(
                              "w-1.5 h-1.5 rounded-full",
                              signal.priority === 'high' ? "bg-destructive" :
                              signal.priority === 'medium' ? "bg-amber-500" : "bg-success"
                            )} />
                            {signal.priority}
                          </span>
                          <span>·</span>
                          <span>{signal.category}</span>
                        </div>
                        <h3 className="text-[14px] font-medium text-foreground truncate">
                          {signal.title}
                        </h3>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-[11px] text-muted-foreground">{signal.summary}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </section>

            {/* News Section */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-title">Relevant news</h2>
                <span className="text-[11px] text-muted-foreground">Today</span>
              </div>
              <div className="space-y-2">
                {newsItems.map((news) => (
                  <button
                    key={news.id}
                    type="button"
                    onClick={() => setSelectedNews(news)}
                    className="w-full text-left p-4 border border-border rounded-xl transition-all duration-200 card-glow"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 text-[11px] text-muted-foreground mb-1.5">
                          <span>{news.source}</span>
                          <span>·</span>
                          <span>{news.date}</span>
                        </div>
                        <h3 className="text-[14px] font-medium text-foreground truncate">
                          {news.title}
                        </h3>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-[11px] text-muted-foreground">{news.summary}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* News Detail Dialog */}
      <Dialog open={!!selectedNews} onOpenChange={() => setSelectedNews(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <div className="flex items-start justify-between gap-4">
              <div>
                <DialogTitle className="text-[16px] font-semibold">
                  {selectedNews?.title}
                </DialogTitle>
                <p className="text-[12px] text-muted-foreground mt-1">
                  {selectedNews?.summary}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-[11px] text-muted-foreground pt-2 border-t border-border mt-3">
              <span>Source: {selectedNews?.source}</span>
              <span>•</span>
              <span>{selectedNews?.date}</span>
            </div>
          </DialogHeader>
          <div className="mt-4">
            <div className="text-[13px] text-foreground leading-relaxed whitespace-pre-line">
              {selectedNews?.content}
            </div>
          </div>
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
            <Button variant="outline" size="sm" shape="squared" onClick={() => setSelectedNews(null)}>
              Close
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              shape="squared"
              onClick={() => {
                setActionTaken(`Opening source document from ${selectedNews?.source}...`);
                setSelectedNews(null);
                setTimeout(() => setActionTaken(null), 3000);
              }}
            >
              <ExternalLinkIcon className="w-3.5 h-3.5 mr-2" />
              Open source
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Signal Detail Dialog */}
      <Dialog open={!!selectedSignal} onOpenChange={() => setSelectedSignal(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <div className="flex items-start gap-3">
              <div className={cn(
                "w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0",
                selectedSignal?.priority === 'high' ? "bg-destructive" :
                selectedSignal?.priority === 'medium' ? "bg-amber-500" : "bg-success"
              )} />
              <div>
                <DialogTitle className="text-[16px] font-semibold">
                  {selectedSignal?.title}
                </DialogTitle>
                <p className="text-[12px] text-muted-foreground mt-1">
                  {selectedSignal?.summary}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-[11px] text-muted-foreground pt-2 border-t border-border mt-3">
              <span className={cn(
                "uppercase tracking-wide",
                selectedSignal?.priority === 'high' ? "text-destructive" :
                selectedSignal?.priority === 'medium' ? "text-amber-600 dark:text-amber-400" : "text-success"
              )}>
                {selectedSignal?.priority} priority
              </span>
              <span>•</span>
              <span>{selectedSignal?.category}</span>
            </div>
          </DialogHeader>
          <div className="mt-4">
            <div className="text-[13px] text-foreground leading-relaxed whitespace-pre-line">
              {selectedSignal?.content}
            </div>
          </div>
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
            <Button variant="outline" size="sm" shape="squared" onClick={() => setSelectedSignal(null)}>
              Close
            </Button>
            <Button size="sm" shape="squared" onClick={() => selectedSignal && handleSignalAction(selectedSignal)}>
              <BellIcon className="w-3.5 h-3.5 mr-2" />
              Take action
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Action notification toast */}
      {actionTaken && (
        <div className="fixed bottom-6 right-6 max-w-sm bg-foreground text-background px-4 py-3 rounded-lg shadow-lg z-50 animate-slide-up">
          <p className="text-[13px]">{actionTaken}</p>
        </div>
      )}
    </div>
  );
}
