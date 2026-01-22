import { DecisionOutcome } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const STATUS_STYLES: Record<DecisionOutcome['status'], string> = {
  on_track: 'bg-success/10 text-success border-success/20',
  at_risk: 'bg-warning/10 text-warning border-warning/20',
  achieved: 'bg-primary/10 text-primary border-primary/20',
  missed: 'bg-destructive/10 text-destructive border-destructive/20',
};

export function DecisionOutcomeCard({
  outcome,
  className,
}: {
  outcome?: DecisionOutcome;
  className?: string;
}) {
  if (!outcome) {
    return (
      <Card className={cn('border-border/60', className)}>
        <CardHeader className="pb-3">
          <CardTitle className="text-[14px] font-medium">Outcome observability</CardTitle>
        </CardHeader>
        <CardContent className="text-[12px] text-muted-foreground">
          Outcome signals will appear after execution begins.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('border-border/60', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-[14px] font-medium">Outcome observability</CardTitle>
          <Badge variant="outline" className={cn('text-[10px] uppercase tracking-wide', STATUS_STYLES[outcome.status])}>
            {outcome.status.replace('_', ' ')}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 text-[12px] text-muted-foreground">
        <div>
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground mb-1">Impact</p>
          <p className="text-foreground">{outcome.impactSummary}</p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground mb-1">Learning signal</p>
          <p>{outcome.learningSignal}</p>
        </div>
      </CardContent>
    </Card>
  );
}
