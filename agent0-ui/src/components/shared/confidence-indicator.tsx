'use client';

import { cn } from '@/lib/utils';

interface ConfidenceIndicatorProps {
  value: number; // 0-100
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export function ConfidenceIndicator({ 
  value, 
  size = 'md', 
  showLabel = false,
  className 
}: ConfidenceIndicatorProps) {
  const getBarColor = (v: number) => {
    if (v >= 80) return 'bg-success';
    if (v >= 60) return 'bg-primary';
    return 'bg-destructive';
  };

  const getTextColor = (v: number) => {
    if (v >= 80) return 'text-success';
    if (v >= 60) return 'text-primary';
    return 'text-destructive';
  };

  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  const barHeight = {
    sm: 'h-1',
    md: 'h-1.5',
    lg: 'h-2',
  };

  const getStatus = (v: number) => {
    if (v >= 80) return 'high';
    if (v >= 60) return 'medium';
    return 'low';
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex items-center gap-1.5">
        {showLabel && (
          <span className={cn("text-muted-foreground", sizeClasses[size])}>
            AI:
          </span>
        )}
        
        <div className="flex items-center gap-1.5">
          <div className={cn(
            "w-12 confidence-bar-track",
            barHeight[size]
          )}>
            <div 
              className="confidence-bar-fill"
              data-status={getStatus(value)}
              style={{ width: `${value}%` }}
            />
          </div>
          
          <span className={cn(
            "font-medium tabular-nums",
            sizeClasses[size],
            getTextColor(value)
          )}>
            {value}%
          </span>
        </div>
      </div>
    </div>
  );
}

interface ConfidenceCircleProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  showValue?: boolean;
  className?: string;
}

export function ConfidenceCircle({ 
  value, 
  size = 48, 
  strokeWidth = 4,
  showValue = true,
  className 
}: ConfidenceCircleProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  const getColor = (v: number) => {
    if (v >= 80) return 'var(--success)';
    if (v >= 60) return 'var(--primary)';
    return 'var(--destructive)';
  };

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg width={size} height={size} className="-rotate-90 confidence-circle-glow">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getColor(value)}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      {showValue && (
        <span 
          className="absolute text-xs font-semibold"
          style={{ color: getColor(value) }}
        >
          {value}
        </span>
      )}
    </div>
  );
}
