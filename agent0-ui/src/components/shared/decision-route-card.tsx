import { DecisionRouteStep } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const STATUS_STYLES: Record<DecisionRouteStep['status'], string> = {
  completed: 'bg-success/10 text-success border-success/20',
  active: 'bg-primary/10 text-primary border-primary/20',
  pending: 'bg-secondary text-muted-foreground border-border',
};

export function DecisionRouteCard({
  steps,
  className,
}: {
  steps?: DecisionRouteStep[];
  className?: string;
}) {
  return (
    <Card className={cn('border-border/60', className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-[14px] font-medium">End-to-end route</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {steps && steps.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2">
            {steps.map((step) => (
              <div key={step.id} className="flex items-center gap-2">
                <span
                  className={cn(
                    'h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full border flex-shrink-0',
                    STATUS_STYLES[step.status]
                  )}
                />
                <span className="text-[11px] sm:text-[12px] text-foreground">{step.label}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[12px] text-muted-foreground">Route visibility will appear once triage begins.</p>
        )}
      </CardContent>
    </Card>
  );
}
