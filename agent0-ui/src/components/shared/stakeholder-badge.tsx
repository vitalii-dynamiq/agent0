'use client';

import { Stakeholder } from '@/lib/types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { HomeIcon, EnvelopeClosedIcon, ArrowUpIcon, ArrowDownIcon, MinusIcon } from '@radix-ui/react-icons';

interface StakeholderBadgeProps {
  stakeholder: Stakeholder;
  variant?: 'minimal' | 'compact' | 'detailed';
  showRelationship?: boolean;
  onClick?: () => void;
  className?: string;
}

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const getRelationshipColor = (score: number) => {
  if (score >= 80) return 'text-foreground';
  if (score >= 60) return 'text-muted-foreground';
  return 'text-muted-foreground';
};

const getRelationshipBg = (score: number) => {
  if (score >= 80) return 'bg-secondary';
  if (score >= 60) return 'bg-secondary';
  return 'bg-secondary';
};

const getAvatarColor = (type: Stakeholder['type']) => {
  switch (type) {
    case 'internal':
      return 'bg-secondary text-foreground';
    case 'government':
      return 'bg-secondary text-foreground';
    case 'external':
      return 'bg-secondary text-foreground';
    default:
      return 'bg-secondary text-muted-foreground';
  }
};

export function StakeholderBadge({ 
  stakeholder, 
  variant = 'compact',
  showRelationship = false,
  onClick,
  className 
}: StakeholderBadgeProps) {
  const avatarColor = getAvatarColor(stakeholder.type);

  if (variant === 'minimal') {
    return (
      <div 
        className={cn(
          "inline-flex items-center gap-2",
          onClick && "cursor-pointer hover:opacity-80",
          className
        )}
        onClick={onClick}
      >
        <Avatar className="h-6 w-6">
          <AvatarFallback className={cn("text-xs", avatarColor)}>
            {getInitials(stakeholder.name)}
          </AvatarFallback>
        </Avatar>
        <span className="text-sm text-foreground">{stakeholder.name}</span>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div 
        className={cn(
          "flex items-center gap-3 p-2 rounded-lg",
          onClick && "cursor-pointer hover:bg-secondary/50 transition-colors",
          className
        )}
        onClick={onClick}
      >
        <Avatar className="h-10 w-10">
          <AvatarFallback className={cn("text-sm font-medium", avatarColor)}>
            {getInitials(stakeholder.name)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">
            {stakeholder.name}
          </p>
          <p className="text-xs text-muted-foreground truncate">
            {stakeholder.title}
          </p>
        </div>
        {showRelationship && (
          <div className={cn(
            "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
            getRelationshipBg(stakeholder.relationshipScore),
            getRelationshipColor(stakeholder.relationshipScore)
          )}>
            {stakeholder.relationshipScore >= 80 ? (
              <ArrowUpIcon className="w-3 h-3" />
            ) : stakeholder.relationshipScore >= 60 ? (
              <MinusIcon className="w-3 h-3" />
            ) : (
              <ArrowDownIcon className="w-3 h-3" />
            )}
            {stakeholder.relationshipScore}%
          </div>
        )}
      </div>
    );
  }

  // Detailed variant
  return (
    <div 
      className={cn(
        "p-4 rounded-xl bg-card border border-border/50",
        onClick && "cursor-pointer hover:bg-secondary/30 hover:border-border transition-all",
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-start gap-4">
        <Avatar className="h-12 w-12">
          <AvatarFallback className={cn("text-base font-medium", avatarColor)}>
            {getInitials(stakeholder.name)}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4 className="font-semibold text-foreground">
                {stakeholder.name}
              </h4>
              <p className="text-sm text-muted-foreground">
                {stakeholder.title}
              </p>
            </div>
            {showRelationship && (
              <div className={cn(
                "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
                getRelationshipBg(stakeholder.relationshipScore),
                getRelationshipColor(stakeholder.relationshipScore)
              )}>
                {stakeholder.relationshipScore}%
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className="text-xs bg-secondary/50">
              <HomeIcon className="w-3 h-3 mr-1" />
              {stakeholder.organization}
            </Badge>
          </div>
          
          <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <EnvelopeClosedIcon className="w-3 h-3" />
              <span>{stakeholder.email}</span>
            </div>
            {stakeholder.phone && (
              <span>{stakeholder.phone}</span>
            )}
          </div>
          
          <div className="flex items-center gap-4 mt-3">
            <div className="text-xs">
              <span className="text-muted-foreground">Open Items: </span>
              <span className="font-medium text-foreground">{stakeholder.openItems}</span>
            </div>
            <div className="text-xs">
              <span className="text-muted-foreground">Pending Decisions: </span>
              <span className="font-medium text-foreground">{stakeholder.pendingDecisions}</span>
            </div>
            <div className="text-xs">
              <span className="text-muted-foreground">Meetings: </span>
              <span className="font-medium text-foreground">{stakeholder.totalMeetings}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface StakeholderAvatarGroupProps {
  stakeholderIds: string[];
  stakeholders: Stakeholder[];
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function StakeholderAvatarGroup({ 
  stakeholderIds, 
  stakeholders,
  max = 4,
  size = 'md',
  className 
}: StakeholderAvatarGroupProps) {
  const visibleStakeholders = stakeholderIds
    .map(id => stakeholders.find(s => s.id === id))
    .filter(Boolean)
    .slice(0, max) as Stakeholder[];
  
  const remaining = stakeholderIds.length - max;

  const sizeClasses = {
    sm: 'h-6 w-6 text-xs -ml-1.5',
    md: 'h-8 w-8 text-sm -ml-2',
    lg: 'h-10 w-10 text-base -ml-2.5',
  };

  return (
    <div className={cn("flex items-center", className)}>
      {visibleStakeholders.map((stakeholder, index) => (
        <Avatar 
          key={stakeholder.id} 
          className={cn(
            sizeClasses[size],
            index === 0 && "ml-0",
            "border-2 border-background"
          )}
        >
          <AvatarFallback className={cn("font-medium", getAvatarColor(stakeholder.type))}>
            {getInitials(stakeholder.name)}
          </AvatarFallback>
        </Avatar>
      ))}
      {remaining > 0 && (
        <div className={cn(
          "flex items-center justify-center rounded-full bg-secondary border-2 border-background font-medium text-muted-foreground",
          sizeClasses[size]
        )}>
          +{remaining}
        </div>
      )}
    </div>
  );
}
