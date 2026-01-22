'use client';

import Link from 'next/link';
import { workflows, auditEntries, decisions } from '@/lib/mock-data';

export default function AdminOverview() {
  const activeDecisions = decisions.filter((decision) => !decision.isPrecedent);
  const recentAudit = auditEntries.slice(0, 5);
  const decisionsInReview = activeDecisions.filter((decision) =>
    !decision.isPrecedent && ['awaiting_review', 'with_chairman', 'in_analysis'].includes(decision.status)
  ).length;
  const slaAtRisk = activeDecisions.filter((decision) => decision.triage?.slaStatus === 'at_risk' || decision.triage?.slaStatus === 'breached').length;
  const executionActive = activeDecisions.filter((decision) => decision.status === 'in_execution').length;
  const outcomesAtRisk = activeDecisions.filter((decision) => decision.outcome?.status === 'at_risk').length;

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-10">
      {/* Subtitle */}
      <div className="flex items-center justify-between">
        <p className="text-[14px] text-muted-foreground">
          Decision engine overview for governance, workflow health, and audit visibility.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-10">
        {/* Execution Signals */}
        <div className="lg:col-span-3">
          <h2 className="text-title mb-4">Execution Signals</h2>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <Link 
              href="/admin/audit?status=in_review" 
              className="p-4 bg-secondary/20 rounded-xl metric-glow"
            >
              <p className="text-xl font-medium tabular-nums text-amber-500 dark:text-amber-300">{decisionsInReview}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">In Review</p>
            </Link>
            <Link 
              href="/admin/audit?status=sla_risk" 
              className="p-4 bg-secondary/20 rounded-xl metric-glow"
            >
              <p className="text-xl font-medium tabular-nums text-rose-500 dark:text-rose-300">{slaAtRisk}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">SLA at Risk</p>
            </Link>
            <Link 
              href="/admin/audit?status=executing" 
              className="p-4 bg-secondary/20 rounded-xl metric-glow"
            >
              <p className="text-xl font-medium tabular-nums text-emerald-500 dark:text-emerald-300">{executionActive}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Executing</p>
            </Link>
            <Link 
              href="/admin/audit?status=outcome_risk" 
              className="p-4 bg-secondary/20 rounded-xl metric-glow"
            >
              <p className="text-xl font-medium tabular-nums text-orange-500 dark:text-orange-300">{outcomesAtRisk}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Outcome at Risk</p>
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <h2 className="text-title mb-4">Quick Actions</h2>
          
          <div className="space-y-1">
            <Link href="/admin/audit" className="flex items-center justify-between p-3 rounded-lg list-item-glow">
              <span className="text-[13px]">Decision Audit Trail</span>
              <svg width="14" height="14" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-muted-foreground">
                <path d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"/>
              </svg>
            </Link>
            <Link href="/admin/workflows" className="flex items-center justify-between p-3 rounded-lg list-item-glow">
              <span className="text-[13px]">Decision Engine Workflows</span>
              <svg width="14" height="14" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-muted-foreground">
                <path d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"/>
              </svg>
            </Link>
            <Link href="/admin/knowledge" className="flex items-center justify-between p-3 rounded-lg list-item-glow">
              <span className="text-[13px]">Knowledge Graph</span>
              <svg width="14" height="14" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-muted-foreground">
                <path d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"/>
              </svg>
            </Link>
            <Link href="/admin/meetings" className="flex items-center justify-between p-3 rounded-lg list-item-glow">
              <span className="text-[13px]">Meeting Intelligence</span>
              <svg width="14" height="14" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-muted-foreground">
                <path d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"/>
              </svg>
            </Link>
            <Link href="/admin/policies" className="flex items-center justify-between p-3 rounded-lg list-item-glow">
              <span className="text-[13px]">Policies</span>
              <svg width="14" height="14" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-muted-foreground">
                <path d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"/>
              </svg>
            </Link>
            <Link href="/admin/integrations" className="flex items-center justify-between p-3 rounded-lg list-item-glow">
              <span className="text-[13px]">Integrations</span>
              <svg width="14" height="14" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-muted-foreground">
                <path d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"/>
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
        {/* Active Workflows */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-title">Active Workflows</h2>
            <Link href="/admin/workflows" className="link-arrow">
              View all
              <svg width="14" height="14" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"/>
              </svg>
            </Link>
          </div>
          
          <div className="border border-border rounded-xl divide-y divide-border overflow-hidden">
            {workflows.filter(w => w.isActive).map((workflow) => (
              <Link 
                key={workflow.id} 
                href="/admin/workflows"
                className="flex items-center justify-between px-4 py-3 list-item-glow"
              >
                <div>
                  <p className="text-[13px] font-medium">{workflow.name}</p>
                  <p className="text-[11px] text-muted-foreground">{workflow.nodes.length} nodes</p>
                </div>
                <svg width="14" height="14" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-muted-foreground">
                  <path d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"/>
                </svg>
              </Link>
            ))}
          </div>
        </div>

        {/* Decision Audit Trail */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-title">Recent Audit Events</h2>
            <Link href="/admin/audit" className="link-arrow">
              View all
              <svg width="14" height="14" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"/>
              </svg>
            </Link>
          </div>
          
          <div className="border border-border rounded-xl divide-y divide-border overflow-hidden">
            {recentAudit.map((entry) => (
              <Link 
                key={entry.id} 
                href="/admin/audit"
                className="flex items-center justify-between px-4 py-3 list-item-glow"
              >
                <div className="flex-1 min-w-0 pr-4">
                  <p className="text-[13px] truncate">{entry.details.reasoning || entry.action.replace('_', ' ')}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {new Date(entry.timestamp).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {typeof entry.details.confidence === 'number' && (
                    <span className="text-[11px] text-muted-foreground tabular-nums">{entry.details.confidence}%</span>
                  )}
                  <svg width="14" height="14" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-muted-foreground">
                    <path d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"/>
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
