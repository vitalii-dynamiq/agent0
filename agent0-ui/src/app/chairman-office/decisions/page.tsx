'use client';

import { useRouter } from 'next/navigation';
import { getPendingDecisionsForChairman, decisions } from '@/lib/mock-data';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CeoPillarBadge, getCeoPillarLabel } from '@/components/shared/ceo-pillar-badge';
import { cn } from '@/lib/utils';
import { 
  ClockIcon,
  ChevronRightIcon,
  CheckIcon,
} from '@radix-ui/react-icons';

export default function ChairmanDecisions() {
  const router = useRouter();
  const pendingDecisions = getPendingDecisionsForChairman();
  const recentDecisions = decisions
    .filter(d => !d.isPrecedent && (d.status === 'completed' || d.status === 'in_execution'))
    .slice(0, 5);

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `AED ${(value / 1000000).toFixed(0)}M`;
    if (value >= 1000) return `AED ${(value / 1000).toFixed(0)}K`;
    return `AED ${value}`;
  };

  const [activeTab, setActiveTab] = React.useState<'pending' | 'recent'>('pending');

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-foreground">Decisions</h1>
        <p className="text-[13px] text-muted-foreground mt-1">
          Review and approve decisions requiring your attention
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-secondary rounded-lg w-fit mb-6">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setActiveTab('pending')}
          className={cn(
            "px-4 py-2 text-[13px] font-medium rounded-md",
            activeTab === 'pending'
              ? "bg-foreground text-background hover:bg-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          Pending Approval
          <span className={cn(
            "text-[11px] tabular-nums px-1.5 py-0.5 rounded",
            activeTab === 'pending' ? "bg-background/20" : "bg-muted"
          )}>
            {pendingDecisions.length}
          </span>
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setActiveTab('recent')}
          className={cn(
            "px-4 py-2 text-[13px] font-medium rounded-md",
            activeTab === 'recent'
              ? "bg-foreground text-background hover:bg-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <ClockIcon className="w-3.5 h-3.5" />
          Recent
        </Button>
      </div>

      {/* Pending Decisions */}
      {activeTab === 'pending' && (
        <div className="space-y-4">
          {pendingDecisions.length > 0 ? (
            <Card>
              <CardContent className="p-0">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-4 text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Decision</th>
                      <th className="text-left p-4 text-[11px] font-medium text-muted-foreground uppercase tracking-wide w-20">Level</th>
                      <th className="text-left p-4 text-[11px] font-medium text-muted-foreground uppercase tracking-wide w-24">Value</th>
                      <th className="text-left p-4 text-[11px] font-medium text-muted-foreground uppercase tracking-wide w-20">Due</th>
                      <th className="text-left p-4 text-[11px] font-medium text-muted-foreground uppercase tracking-wide whitespace-nowrap">AI Rec.</th>
                      <th className="p-4 w-12"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingDecisions.map((decision) => (
                      <tr 
                        key={decision.id} 
                        className="border-b border-border last:border-0 cursor-pointer table-row-glow"
                        onClick={() => router.push(`/chairman-office/decision/${decision.id}`)}
                      >
                        <td className="p-4">
                          <div>
                            <p className="text-[14px] font-medium text-foreground">{decision.title}</p>
                            <p className="text-[12px] text-muted-foreground mt-0.5 line-clamp-1">
                              {decision.description}
                            </p>
                            <div className="mt-2">
                              <CeoPillarBadge pillar={decision.ceoPillar} />
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="inline-flex items-center justify-center whitespace-nowrap text-[11px] px-2 py-1 border border-border rounded">
                            Level {decision.level}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="text-[13px] font-medium tabular-nums">
                            {decision.value ? formatCurrency(decision.value) : '—'}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="text-[12px] text-muted-foreground whitespace-nowrap">
                            {new Date(decision.dueDate).toLocaleDateString('en-AE', { 
                              day: 'numeric', 
                              month: 'short' 
                            })}
                          </span>
                        </td>
                        <td className="p-4">
                          {decision.aiRecommendation && (
                            <div className="flex items-center gap-1.5 whitespace-nowrap">
                              <span className="text-[12px] capitalize">{decision.aiRecommendation}</span>
                              <span className="text-[11px] text-muted-foreground tabular-nums">
                                {decision.aiConfidence}%
                              </span>
                            </div>
                          )}
                        </td>
                        <td className="p-4">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <ChevronRightIcon className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          ) : (
            <EmptyState 
              title="All caught up"
              description="No decisions require your immediate attention."
            />
          )}
        </div>
      )}

      {/* Recent Decisions */}
      {activeTab === 'recent' && (
        <div className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-4 text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Decision</th>
                    <th className="text-left p-4 text-[11px] font-medium text-muted-foreground uppercase tracking-wide w-28">Value</th>
                    <th className="text-left p-4 text-[11px] font-medium text-muted-foreground uppercase tracking-wide w-28">Status</th>
                    <th className="text-left p-4 text-[11px] font-medium text-muted-foreground uppercase tracking-wide w-28">Completed</th>
                  </tr>
                </thead>
                <tbody>
                  {recentDecisions.map((decision) => (
                    <tr 
                      key={decision.id} 
                      className="border-b border-border last:border-0 cursor-pointer table-row-glow"
                      onClick={() => router.push(`/chairman-office/decision/${decision.id}`)}
                    >
                      <td className="p-4">
                        <div>
                          <p className="text-[14px] font-medium text-foreground">{decision.title}</p>
                          <p className="text-[12px] text-muted-foreground mt-0.5">
                            Level {decision.level} · {decision.category} · {getCeoPillarLabel(decision.ceoPillar)}
                          </p>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-[13px] font-medium tabular-nums">
                          {decision.value ? formatCurrency(decision.value) : '—'}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="text-[11px] px-2 py-1 bg-secondary rounded capitalize">
                          {decision.status === 'completed' ? 'Completed' : 'In Execution'}
                        </span>
                      </td>
                      <td className="p-4 text-[12px] text-muted-foreground">
                        {new Date(decision.updatedAt).toLocaleDateString('en-AE', { 
                          day: 'numeric', 
                          month: 'short' 
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

import React from 'react';

function EmptyState({ 
  title, 
  description 
}: { 
  title: string; 
  description: string;
}) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mb-4">
          <CheckIcon className="w-6 h-6 text-muted-foreground" />
        </div>
        <h3 className="text-[15px] font-semibold text-foreground mb-1">{title}</h3>
        <p className="text-[13px] text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
