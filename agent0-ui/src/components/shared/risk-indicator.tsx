'use client';

import { RiskLevel, RiskAssessment } from '@/lib/types';
import { cn } from '@/lib/utils';
import { LockClosedIcon, ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface RiskIndicatorProps {
  level: RiskLevel;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

const riskConfig: Record<RiskLevel, { 
  label: string; 
  color: string; 
  bgColor: string;
  borderColor: string;
  icon: React.ComponentType<{ className?: string }>;
}> = {
  low: { 
    label: 'Low Risk', 
    color: 'text-foreground', 
    bgColor: 'bg-secondary',
    borderColor: 'border-border',
    icon: LockClosedIcon 
  },
  medium: { 
    label: 'Medium Risk', 
    color: 'text-foreground', 
    bgColor: 'bg-secondary',
    borderColor: 'border-border',
    icon: LockClosedIcon 
  },
  high: { 
    label: 'High Risk', 
    color: 'text-foreground', 
    bgColor: 'bg-secondary',
    borderColor: 'border-border',
    icon: ExclamationTriangleIcon 
  },
  critical: { 
    label: 'Critical', 
    color: 'text-foreground', 
    bgColor: 'bg-secondary',
    borderColor: 'border-border',
    icon: ExclamationTriangleIcon 
  },
};

export function RiskIndicator({ level, size = 'md', showLabel = true, className }: RiskIndicatorProps) {
  const config = riskConfig[level];
  const Icon = config.icon;

  const sizeClasses = {
    sm: { container: 'gap-1 text-xs', icon: 'w-3 h-3', padding: 'px-2 py-0.5' },
    md: { container: 'gap-1.5 text-sm', icon: 'w-4 h-4', padding: 'px-2.5 py-1' },
    lg: { container: 'gap-2 text-base', icon: 'w-5 h-5', padding: 'px-3 py-1.5' },
  };

  return (
    <div 
      className={cn(
        "inline-flex items-center rounded-md border",
        sizeClasses[size].container,
        sizeClasses[size].padding,
        config.bgColor,
        config.borderColor,
        config.color,
        className
      )}
    >
      <Icon className={sizeClasses[size].icon} />
      {showLabel && <span className="font-medium">{config.label}</span>}
    </div>
  );
}

interface RiskAssessmentCardProps {
  assessment: RiskAssessment;
  className?: string;
}

export function RiskAssessmentCard({ assessment, className }: RiskAssessmentCardProps) {
  const categories = [
    { key: 'financial', label: 'Financial', level: assessment.financial },
    { key: 'operational', label: 'Operational', level: assessment.operational },
    { key: 'reputational', label: 'Reputational', level: assessment.reputational },
  ];

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <LockClosedIcon className="w-4 h-4" />
            Risk Assessment
          </CardTitle>
          <Badge variant="outline" className="bg-secondary text-foreground border-border">
            {assessment.overall} risk
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        {categories.map(({ key, label, level }) => (
          <RiskBar key={key} label={label} level={level} />
        ))}

        {assessment.factors && assessment.factors.length > 0 && (
          <div className="pt-3 border-t border-border">
            <p className="text-xs text-muted-foreground mb-2">Key Factors</p>
            <ul className="space-y-1">
              {assessment.factors.map((factor, index) => (
                <li key={index} className="text-xs text-foreground flex items-start gap-2">
                  <span className="text-muted-foreground">•</span>
                  {factor}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function RiskBar({ label, level }: { label: string; level: 'low' | 'medium' | 'high' | 'critical' }) {
  const value = level === 'low' ? 25 : level === 'medium' ? 50 : level === 'high' ? 75 : 90;
  
  const textColorClass = {
    low: 'risk-text-low',
    medium: 'risk-text-medium',
    high: 'risk-text-high',
    critical: 'risk-text-critical',
  }[level];
  
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className={cn("text-xs font-medium capitalize", textColorClass)}>{level}</span>
      </div>
      <div className="risk-bar-track">
        <div 
          className="risk-bar-fill" 
          data-level={level}
          style={{ width: `${value}%` }} 
        />
      </div>
    </div>
  );
}
