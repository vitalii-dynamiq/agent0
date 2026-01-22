import { DecisionTriage } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const SLA_STYLES: Record<DecisionTriage['slaStatus'], string> = {
  on_track: 'bg-success/10 text-success border-success/20',
  at_risk: 'bg-warning/10 text-warning border-warning/20',
  breached: 'bg-destructive/10 text-destructive border-destructive/20',
};

export function DecisionTriageCard({
  triage,
  className,
}: {
  triage?: DecisionTriage;
  className?: string;
}) {
  if (!triage) {
    return (
      <Card className={cn('border-border/60', className)}>
        <CardHeader className="pb-3">
          <CardTitle className="text-[14px] font-medium">Triage & SLA</CardTitle>
        </CardHeader>
        <CardContent className="text-[12px] text-muted-foreground">
          Triage details will appear once queued.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('border-border/60', className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-[14px] font-medium">Triage & SLA</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-[12px] text-muted-foreground">
        <div className="flex items-center justify-between">
          <span>Priority</span>
          <Badge variant="outline" className="text-[10px] uppercase tracking-wide">
            {triage.priority}
          </Badge>
        </div>
        <div className="flex items-center justify-between">
          <span>Queue position</span>
          <span className="text-foreground font-medium">#{triage.queuePosition}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>SLA target</span>
          <span className="text-foreground font-medium">{triage.slaTargetHours}h</span>
        </div>
        <div className="flex items-center justify-between">
          <span>SLA status</span>
          <Badge variant="outline" className={cn('text-[10px] uppercase tracking-wide', SLA_STYLES[triage.slaStatus])}>
            {triage.slaStatus.replace('_', ' ')}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
