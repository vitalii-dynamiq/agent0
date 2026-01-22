import { WorkflowStep } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const STATUS_STYLES: Record<WorkflowStep['status'], string> = {
  completed: 'bg-success/10 border-success/20 text-success',
  active: 'bg-primary/10 border-primary/20 text-primary',
  pending: 'bg-secondary text-muted-foreground border-border',
  skipped: 'bg-secondary text-muted-foreground border-border',
};

export function WorkflowTimeline({ steps, className }: { steps?: WorkflowStep[]; className?: string }) {
  return (
    <Card className={cn("border-border/60", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-[14px] font-medium">Decision workflow</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {steps && steps.length > 0 ? (
          steps.map((step, index) => (
            <div key={step.id} className="flex items-start gap-3">
              <div className={cn(
                "mt-0.5 h-6 w-6 rounded-full border flex items-center justify-center text-[10px] font-medium",
                STATUS_STYLES[step.status]
              )}>
                {index + 1}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[12px] font-medium text-foreground">{step.name}</p>
                  <span className={cn("text-[10px] uppercase tracking-wide px-2 py-0.5 rounded border", STATUS_STYLES[step.status])}>
                    {step.status}
                  </span>
                </div>
                {step.notes && (
                  <p className="text-[11px] text-muted-foreground mt-1">{step.notes}</p>
                )}
                {step.completedAt && (
                  <p className="text-[10px] text-muted-foreground mt-1">
                    {new Date(step.completedAt).toLocaleString('en-AE', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                  </p>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-[12px] text-muted-foreground">Workflow steps will appear once intake is complete.</p>
        )}
      </CardContent>
    </Card>
  );
}
