import { DecisionExecution } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const MILESTONE_STYLES: Record<'pending' | 'active' | 'completed', string> = {
  pending: 'bg-secondary text-muted-foreground border-border',
  active: 'bg-primary/10 text-primary border-primary/20',
  completed: 'bg-success/10 text-success border-success/20',
};

export function DecisionExecutionCard({
  execution,
  className,
}: {
  execution?: DecisionExecution;
  className?: string;
}) {
  if (!execution) {
    return (
      <Card className={cn('border-border/60', className)}>
        <CardHeader className="pb-3">
          <CardTitle className="text-[14px] font-medium">Execution tracking</CardTitle>
        </CardHeader>
        <CardContent className="text-[12px] text-muted-foreground">
          Execution tracking will appear after approval.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('border-border/60', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-[14px] font-medium">Execution tracking</CardTitle>
          <span className="text-[11px] text-muted-foreground">{execution.progress}%</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-foreground rounded-full"
              style={{ width: `${execution.progress}%` }}
            />
          </div>
          <p className="text-[11px] text-muted-foreground mt-2">Owner: {execution.owner}</p>
        </div>
        <div className="space-y-2">
          {execution.milestones.map((milestone) => (
            <div key={milestone.id} className="flex items-center justify-between gap-3 text-[12px]">
              <div>
                <p className="text-foreground">{milestone.title}</p>
                {milestone.eta && (
                  <p className="text-[11px] text-muted-foreground">ETA {milestone.eta}</p>
                )}
              </div>
              <Badge
                variant="outline"
                className={cn('text-[10px] uppercase tracking-wide', MILESTONE_STYLES[milestone.status])}
              >
                {milestone.status}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
