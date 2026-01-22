'use client';

import { Decision } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ClockIcon, 
  HomeIcon,
  ArrowUpIcon,
  ExclamationTriangleIcon,
  CheckCircledIcon,
  ArrowTopRightIcon
} from '@radix-ui/react-icons';
import { cn } from '@/lib/utils';
import { ConfidenceIndicator } from './confidence-indicator';
import { stakeholders, departments } from '@/lib/mock-data';

interface DecisionCardProps {
  decision: Decision;
  variant?: 'compact' | 'default' | 'detailed';
  onClick?: () => void;
  className?: string;
}

const levelLabels: Record<number, { label: string; className: string }> = {
  1: { label: 'Autonomous', className: 'level-1' },
  2: { label: 'Collaborative', className: 'level-2' },
  3: { label: 'Advisory', className: 'level-3' },
};

const statusConfig: Record<string, { label: string; className: string; icon: React.ComponentType<{ className?: string }> }> = {
  incoming: { label: 'Incoming', className: 'bg-secondary text-foreground border-border', icon: ClockIcon },
  classifying: { label: 'Classifying', className: 'bg-secondary text-foreground border-border', icon: ArrowUpIcon },
  in_analysis: { label: 'In Analysis', className: 'bg-secondary text-foreground border-border', icon: ArrowUpIcon },
  awaiting_review: { label: 'Awaiting Review', className: 'bg-secondary text-foreground border-border', icon: ClockIcon },
  with_chairman: { label: 'With Chairman', className: 'bg-secondary text-foreground border-border', icon: ExclamationTriangleIcon },
  in_execution: { label: 'In Execution', className: 'bg-secondary text-foreground border-border', icon: ArrowUpIcon },
  completed: { label: 'Completed', className: 'bg-secondary text-foreground border-border', icon: CheckCircledIcon },
  rejected: { label: 'Rejected', className: 'bg-secondary text-foreground border-border', icon: ExclamationTriangleIcon },
};

const categoryLabels: Record<string, string> = {
  procurement: 'Procurement',
  budget: 'Budget',
  policy: 'Policy',
  hr: 'HR',
  partnership: 'Partnership',
  infrastructure: 'Infrastructure',
  strategic: 'Strategic',
};

export function DecisionCard({ decision, variant = 'default', onClick, className }: DecisionCardProps) {
  const level = levelLabels[decision.level];
  const status = statusConfig[decision.status];
  const requester = stakeholders.find(s => s.id === decision.requesterId);
  const department = departments.find(d => d.id === decision.departmentId);
  const StatusIcon = status.icon;

  const formatValue = (value?: number) => {
    if (!value) return null;
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(value);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-AE', {
      day: 'numeric',
      month: 'short',
    });
  };

  if (variant === 'compact') {
    return (
      <Card 
        className={cn(
          "cursor-pointer hover:shadow-sm hover:border-navy/20 transition-all",
          className
        )}
        onClick={onClick}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm text-foreground truncate">
                {decision.title}
              </h4>
              <p className="text-xs text-muted-foreground mt-1">
                {department?.shortName || '—'} • {formatDate(decision.dueDate)}
              </p>
            </div>
            <div className="flex flex-col items-end gap-1">
              {decision.value && (
                <span className="text-sm font-medium text-foreground tabular-nums">
                  {formatValue(decision.value)}
                </span>
              )}
              {decision.aiConfidence && (
                <ConfidenceIndicator value={decision.aiConfidence} size="sm" />
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      className={cn(
        "cursor-pointer hover:shadow-sm hover:border-navy/20 transition-all",
        className
      )}
      onClick={onClick}
    >
      <CardContent className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className={cn("text-xs", level.className)}>
                Level {decision.level}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {categoryLabels[decision.category]}
              </Badge>
              {decision.escalatedFrom && (
                <Badge variant="outline" className="text-xs bg-secondary text-foreground border-border">
                  <ArrowTopRightIcon className="w-3 h-3 mr-1" />
                  Escalated
                </Badge>
              )}
            </div>
            <h3 className="font-semibold text-foreground">
              {decision.title}
            </h3>
          </div>
          {decision.value && (
            <div className="text-right">
              <span className="text-lg font-semibold text-foreground tabular-nums">
                {formatValue(decision.value)}
              </span>
            </div>
          )}
        </div>

        {/* Description */}
        {variant === 'detailed' && decision.description && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {decision.description}
          </p>
        )}

        {/* Meta */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <HomeIcon className="w-4 h-4" />
              <span>{department?.shortName || '—'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ClockIcon className="w-4 h-4" />
              <span>Due {formatDate(decision.dueDate)}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {decision.aiConfidence && (
              <ConfidenceIndicator value={decision.aiConfidence} size="sm" showLabel />
            )}
            <Badge variant="outline" className={cn("text-xs", status.className)}>
              <StatusIcon className="w-3 h-3 mr-1" />
              {status.label}
            </Badge>
          </div>
        </div>

        {/* AI Recommendation Preview */}
        {variant === 'detailed' && decision.aiRecommendation && (
          <div className="mt-4 p-3 rounded-lg bg-muted border border-border">
            <div className="flex items-center gap-2 mb-1">
              <div className={cn(
                "w-2 h-2 rounded-full",
                decision.aiRecommendation === 'approve' ? 'bg-foreground' :
                decision.aiRecommendation === 'reject' ? 'bg-muted-foreground' : 'bg-muted-foreground'
              )} />
              <span className="text-sm font-medium text-foreground">
                AI Recommendation: {decision.aiRecommendation.charAt(0).toUpperCase() + decision.aiRecommendation.slice(1)}
              </span>
            </div>
            {decision.aiReasoning && (
              <p className="text-xs text-muted-foreground line-clamp-2">
                {decision.aiReasoning}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
