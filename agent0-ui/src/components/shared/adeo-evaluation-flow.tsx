import { AdeoFlowStep } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const STATUS_STYLES: Record<AdeoFlowStep['status'], string> = {
  completed: 'bg-success/10 border-success/20 text-success',
  in_progress: 'bg-primary/10 border-primary/20 text-primary',
  pending: 'bg-secondary text-muted-foreground border-border',
};

export function AdeoEvaluationFlow({
  steps,
  className,
}: {
  steps?: AdeoFlowStep[];
  className?: string;
}) {
  return (
    <Card className={cn("border-border/60", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-[14px] font-medium">ADEO evaluation flow</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {steps && steps.length > 0 ? (
          steps.map((step, index) => (
            <div key={step.id} className="flex items-start gap-3 min-w-0">
              <div className={cn(
                "mt-0.5 h-6 w-6 rounded-full border flex items-center justify-center text-[10px] font-medium",
                STATUS_STYLES[step.status]
              )}>
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <p className="text-[12px] font-medium text-foreground break-words">{step.label}</p>
                  <span className={cn("text-[10px] uppercase tracking-wide px-2 py-0.5 rounded border", STATUS_STYLES[step.status])}>
                    {step.status.replace('_', ' ')}
                  </span>
                </div>
                {step.notes && (
                  <p className="text-[11px] text-muted-foreground mt-1 break-words">{step.notes}</p>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-[12px] text-muted-foreground">ADEO evaluation steps will appear once initiated.</p>
        )}
      </CardContent>
    </Card>
  );
}
