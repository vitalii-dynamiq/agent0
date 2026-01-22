import { AuthorityBarometerOutput } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const STATUS_LABELS: Record<AuthorityBarometerOutput['status'], string> = {
  auto: 'Auto',
  review: 'Human Review',
  chairman: 'Executive Review',
};

const STATUS_STYLES: Record<AuthorityBarometerOutput['status'], string> = {
  auto: 'bg-success/10 text-success border-success/20',
  review: 'bg-primary/10 text-primary border-primary/20',
  chairman: 'bg-secondary text-muted-foreground border-border',
};

export function AuthorityBarometerCard({
  authority,
  variant = 'summary',
  className,
}: {
  authority?: AuthorityBarometerOutput;
  variant?: 'summary' | 'detail';
  className?: string;
}) {
  if (!authority) {
    return (
      <Card className={cn("border-border/60", className)}>
        <CardHeader className="pb-3">
          <CardTitle className="text-[14px] font-medium">Authority Barometer</CardTitle>
        </CardHeader>
        <CardContent className="text-[12px] text-muted-foreground">
          No authority signal available yet.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("border-border/60", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-[14px] font-medium">Authority Barometer</CardTitle>
          <Badge variant="outline" className={cn("text-[10px] uppercase tracking-wide", STATUS_STYLES[authority.status])}>
            {STATUS_LABELS[authority.status]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between text-[12px] text-muted-foreground">
          <span>Recommended tier</span>
          <span className="text-foreground font-medium">L{authority.tier}</span>
        </div>
        <div>
          <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1">
            <span>Confidence</span>
            <span className="tabular-nums">{authority.confidence}%</span>
          </div>
          <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-foreground rounded-full"
              style={{ width: `${authority.confidence}%` }}
            />
          </div>
        </div>
        <div>
          <p className="text-[11px] text-muted-foreground mb-2">Drivers</p>
          <ul className="space-y-1">
            {authority.drivers.slice(0, variant === 'detail' ? authority.drivers.length : 2).map((driver, idx) => (
              <li key={idx} className="text-[12px] text-foreground flex items-start gap-2">
                <span className="text-muted-foreground">•</span>
                {driver}
              </li>
            ))}
          </ul>
        </div>
        {variant === 'detail' && (
          <p className="text-[11px] text-muted-foreground">
            Last updated {new Date(authority.lastUpdated).toLocaleString('en-AE', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
