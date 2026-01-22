'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { decisions, getDecisionAnalytics, getDepartmentById } from '@/lib/mock-data';
import { CeoPillarBadge } from '@/components/shared/ceo-pillar-badge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { MagnifyingGlassIcon, PlusIcon } from '@radix-ui/react-icons';
import { Decision, DecisionStatus } from '@/lib/types';

const pipelineColumns: { 
  id: string;
  statuses: DecisionStatus[]; 
  label: string; 
}[] = [
  { id: 'incoming', statuses: ['incoming'], label: 'Incoming' },
  { id: 'review', statuses: ['in_analysis', 'awaiting_review'], label: 'Review' },
  { id: 'execution', statuses: ['with_chairman', 'in_execution'], label: 'Execution' },
  { id: 'completed', statuses: ['completed'], label: 'Completed' },
];

export default function OperationsPipeline() {
  const router = useRouter();
  const analytics = getDecisionAnalytics();
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState<'all' | '1' | '2' | '3'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all');
  const [sortBy, setSortBy] = useState<'due' | 'priority' | 'value' | 'confidence'>('due');
  const [escalatedOnly, setEscalatedOnly] = useState(false);

  const filteredDecisions = useMemo(() => {
    let items = decisions.filter((decision) => !decision.isPrecedent);
    const query = searchTerm.trim().toLowerCase();

    if (query) {
      items = items.filter((decision) => {
        const department = getDepartmentById(decision.departmentId);
        return [
          decision.title,
          decision.category,
          decision.id,
          department?.name,
          department?.shortName,
        ]
          .filter(Boolean)
          .some((value) => value!.toLowerCase().includes(query));
      });
    }

    if (levelFilter !== 'all') {
      items = items.filter((decision) => `${decision.level}` === levelFilter);
    }

    if (priorityFilter !== 'all') {
      items = items.filter((decision) => decision.triage?.priority === priorityFilter);
    }

    if (escalatedOnly) {
      items = items.filter((decision) => Boolean(decision.escalatedFrom));
    }

    const priorityRank: Record<'low' | 'medium' | 'high', number> = {
      low: 1,
      medium: 2,
      high: 3,
    };

    return [...items].sort((a, b) => {
      if (sortBy === 'priority') {
        return (priorityRank[b.triage?.priority ?? 'low'] ?? 0) - (priorityRank[a.triage?.priority ?? 'low'] ?? 0);
      }
      if (sortBy === 'value') {
        return (b.value ?? 0) - (a.value ?? 0);
      }
      if (sortBy === 'confidence') {
        return (b.aiConfidence ?? 0) - (a.aiConfidence ?? 0);
      }
      return (
        new Date(`${a.dueDate}T00:00:00`).getTime() -
        new Date(`${b.dueDate}T00:00:00`).getTime()
      );
    });
  }, [searchTerm, levelFilter, priorityFilter, sortBy, escalatedOnly]);

  const hasFilters =
    searchTerm.trim().length > 0 ||
    levelFilter !== 'all' ||
    priorityFilter !== 'all' ||
    escalatedOnly;

  return (
    <div className="h-[calc(100vh-56px)] flex flex-col bg-background">
      {/* Stats */}
      <div className="px-6 pt-6 pb-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-[13px] text-muted-foreground">Pipeline snapshot</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-b border-border pb-6">
          <div className="rounded-lg border border-border/60 bg-secondary/30 px-4 py-3">
            <p className="text-2xl font-medium tabular-nums text-primary">{analytics.total}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Total Active</p>
          </div>
          <div className="rounded-lg border border-border/60 bg-secondary/30 px-4 py-3">
            <p className="text-2xl font-medium tabular-nums text-emerald-600 dark:text-emerald-300">{analytics.byLevel[1]}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">L1 Auto</p>
          </div>
          <div className="rounded-lg border border-border/60 bg-secondary/30 px-4 py-3">
            <p className="text-2xl font-medium tabular-nums text-amber-600 dark:text-amber-300">{analytics.byLevel[2]}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">L2 Collab</p>
          </div>
          <div className="rounded-lg border border-border/60 bg-secondary/30 px-4 py-3">
            <p className="text-2xl font-medium tabular-nums text-indigo-600 dark:text-indigo-300">{analytics.byLevel[3]}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">L3 Advisory</p>
          </div>
        </div>
      </div>

      {/* Pipeline Controls */}
      <div className="px-6 pb-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 flex-wrap items-center gap-2">
            <div className="relative min-w-[220px] flex-1 lg:flex-none lg:w-72">
              <MagnifyingGlassIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search decisions..."
                className="h-9 pl-8"
              />
            </div>
            <Select value={levelFilter} onValueChange={(value) => setLevelFilter(value as 'all' | '1' | '2' | '3')}>
              <SelectTrigger className="h-9 w-[140px]">
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All levels</SelectItem>
                <SelectItem value="1">L1 Auto</SelectItem>
                <SelectItem value="2">L2 Collab</SelectItem>
                <SelectItem value="3">L3 Advisory</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={priorityFilter}
              onValueChange={(value) => setPriorityFilter(value as 'all' | 'low' | 'medium' | 'high')}
            >
              <SelectTrigger className="h-9 w-[140px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All priority</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={sortBy}
              onValueChange={(value) => setSortBy(value as 'due' | 'priority' | 'value' | 'confidence')}
            >
              <SelectTrigger className="h-9 w-[150px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="due">Sort: Due date</SelectItem>
                <SelectItem value="priority">Sort: Priority</SelectItem>
                <SelectItem value="value">Sort: Value</SelectItem>
                <SelectItem value="confidence">Sort: AI confidence</SelectItem>
              </SelectContent>
            </Select>
            <Button
              type="button"
              variant={escalatedOnly ? 'secondary' : 'outline'}
              size="sm"
              className="h-9"
              onClick={() => setEscalatedOnly((prev) => !prev)}
            >
              Escalated
            </Button>
            {hasFilters && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-9 text-muted-foreground"
                onClick={() => {
                  setSearchTerm('');
                  setLevelFilter('all');
                  setPriorityFilter('all');
                  setSortBy('due');
                  setEscalatedOnly(false);
                }}
              >
                Clear
              </Button>
            )}
          </div>
          <div className="flex items-center gap-3 justify-between lg:justify-end">
            <span className="text-[11px] text-muted-foreground tabular-nums">
              Showing {filteredDecisions.length} of {analytics.total}
            </span>
            <Button size="sm" className="h-9">
              <PlusIcon className="w-4 h-4 mr-1" />
              New decision
            </Button>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto overflow-y-auto px-6 pb-6 min-h-0">
        <div className="flex gap-3 min-h-full">
          {pipelineColumns.map((column) => {
            const columnDecisions = filteredDecisions.filter((decision) => column.statuses.includes(decision.status));

            return (
              <div key={column.id} className="flex-shrink-0 w-64">
                <div className="h-full border border-border rounded-lg flex flex-col">
                  {/* Column Header */}
                  <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                    <span className="text-[13px] font-medium">{column.label}</span>
                    <span className="text-[11px] text-muted-foreground tabular-nums">
                      {columnDecisions.length}
                    </span>
                  </div>
                  
                  {/* Cards */}
                  <div className="flex-1 p-2 space-y-2">
                    {columnDecisions.map((decision) => (
                      <PipelineCard 
                        key={decision.id}
                        decision={decision}
                        onClick={() => router.push(`/operations/decision/${decision.id}`)}
                      />
                    ))}
                    {columnDecisions.length === 0 && (
                      <div className="text-center py-10 text-[12px] text-muted-foreground">
                        No items
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

interface PipelineCardProps {
  decision: Decision;
  onClick: () => void;
}

function PipelineCard({ decision, onClick }: PipelineCardProps) {
  const department = getDepartmentById(decision.departmentId);
  const priority = decision.triage?.priority ?? 'low';
  const slaStatus = decision.triage?.slaStatus ?? 'on_track';
  const queuePosition = decision.triage?.queuePosition;
  const owner = decision.execution?.owner ?? 'Delivery PMO';

  const formatDate = (value: string) => {
    return new Date(`${value}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getDueMeta = (value: string) => {
    const dueDate = new Date(`${value}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffDays = Math.round((dueDate.getTime() - today.getTime()) / 86400000);

    if (diffDays < 0) {
      return {
        label: 'Overdue',
        className: 'bg-destructive/10 text-destructive border-destructive/20',
      };
    }
    if (diffDays === 0) {
      return {
        label: 'Due today',
        className: 'bg-amber-500/10 text-amber-700 border-amber-500/20 dark:text-amber-300',
      };
    }
    if (diffDays === 1) {
      return {
        label: 'Due tomorrow',
        className: 'bg-amber-500/10 text-amber-700 border-amber-500/20 dark:text-amber-300',
      };
    }
    if (diffDays <= 7) {
      return {
        label: `Due in ${diffDays}d`,
        className: 'bg-amber-500/10 text-amber-700 border-amber-500/20 dark:text-amber-300',
      };
    }
    return {
      label: `Due ${formatDate(value)}`,
      className: 'bg-secondary text-muted-foreground border-border',
    };
  };

  const priorityLabel = priority === 'high' ? 'High' : priority === 'medium' ? 'Medium' : 'Low';
  const priorityTone = {
    low: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-300',
    medium: 'bg-amber-500/10 text-amber-700 border-amber-500/20 dark:text-amber-300',
    high: 'bg-rose-500/10 text-rose-600 border-rose-500/20 dark:text-rose-300',
  } as const;

  const slaTone = {
    on_track: {
      dot: 'bg-emerald-500',
      text: 'text-emerald-600 dark:text-emerald-300',
      label: 'SLA on track',
    },
    at_risk: {
      dot: 'bg-amber-500',
      text: 'text-amber-600 dark:text-amber-300',
      label: 'SLA at risk',
    },
    breached: {
      dot: 'bg-rose-500',
      text: 'text-rose-600 dark:text-rose-300',
      label: 'SLA breached',
    },
  };

  const dueMeta = getDueMeta(decision.dueDate);
  const slaMeta = slaTone[slaStatus] ?? slaTone.on_track;
  
  const formatValue = (value?: number) => {
    if (!value) return null;
    if (value >= 1000000) return `${(value / 1000000).toFixed(0)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
    return `${value}`;
  };

  return (
    <div 
      onClick={onClick}
      className="p-3 rounded-lg border border-border hover:border-foreground/20 hover:shadow-sm cursor-pointer transition-colors bg-card"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] text-muted-foreground">L{decision.level}</span>
          <Badge variant="outline" className={cn("text-[10px]", priorityTone[priority])}>
            {priorityLabel} priority
          </Badge>
          {decision.escalatedFrom && (
            <Badge
              variant="outline"
              className="text-[10px] bg-amber-500/10 text-amber-700 border-amber-500/20 dark:text-amber-300"
            >
              Escalated
            </Badge>
          )}
        </div>
        <Badge
          variant="outline"
          className={cn("text-[10px]", dueMeta.className)}
          title={formatDate(decision.dueDate)}
        >
          {dueMeta.label}
        </Badge>
      </div>

      {/* Title */}
      <h4 className="text-[13px] font-medium mb-2 line-clamp-2 leading-snug">
        {decision.title}
      </h4>
      <div className="mb-2">
        <CeoPillarBadge pillar={decision.ceoPillar} className="bg-secondary/50" />
      </div>

      {/* Meta */}
      <div className="flex items-center gap-2 text-[11px] text-muted-foreground mb-2 min-w-0">
        <span className="truncate">{department?.shortName || '—'}</span>
        <span>·</span>
        <span className="truncate">{owner}</span>
      </div>

      <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-2">
        <div className="flex items-center gap-1">
          <span className={cn("h-1.5 w-1.5 rounded-full", slaMeta.dot)} />
          <span className={cn("text-[10px]", slaMeta.text)}>{slaMeta.label}</span>
        </div>
        {queuePosition && (
          <span className="text-[10px] text-muted-foreground tabular-nums">Queue #{queuePosition}</span>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-border">
        {decision.value ? (
          <span className="text-[12px] font-medium tabular-nums">
            AED {formatValue(decision.value)}
          </span>
        ) : (
          <span className="text-[11px] text-muted-foreground">—</span>
        )}
        {decision.aiConfidence && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-1 bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-foreground rounded-full"
                style={{ width: `${decision.aiConfidence}%` }}
              />
            </div>
            <span className="text-[10px] text-muted-foreground tabular-nums">{decision.aiConfidence}%</span>
          </div>
        )}
      </div>
    </div>
  );
}
