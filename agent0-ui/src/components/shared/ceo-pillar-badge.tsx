import { CeoPillar } from '@/lib/types';
import { cn } from '@/lib/utils';

const PILLAR_LABELS: Record<CeoPillar, string> = {
  priority_setting: 'Priority & Foresight',
  operational_alignment: 'Operational Alignment',
  team_talent: 'Team & Talent',
  board_engagement: 'Board & Leadership',
  communications: 'Internal & External Comms',
  personal_effectiveness: 'Personal Effectiveness',
};

export function CeoPillarBadge({ pillar, className }: { pillar: CeoPillar; className?: string }) {
  return (
    <span
      className={cn(
        "text-[10px] sm:text-[11px] px-1.5 sm:px-2 py-0.5 sm:py-1 border border-border rounded text-muted-foreground bg-secondary/40 whitespace-nowrap",
        className
      )}
    >
      {PILLAR_LABELS[pillar]}
    </span>
  );
}

export const getCeoPillarLabel = (pillar: CeoPillar) => PILLAR_LABELS[pillar];
