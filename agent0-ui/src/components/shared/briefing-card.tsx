'use client';

import { BriefingCard as BriefingCardType } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { 
  FileTextIcon, 
  CalendarIcon, 
  BookmarkIcon, 
  ExclamationTriangleIcon, 
  LightningBoltIcon,
  ChevronRightIcon
} from '@radix-ui/react-icons';
import Link from 'next/link';

interface BriefingCardProps {
  card: BriefingCardType;
  className?: string;
}

const typeConfig: Record<BriefingCardType['type'], {
  icon: React.ElementType;
  color: string;
  bgColor: string;
  borderColor: string;
}> = {
  decisions: {
    icon: FileTextIcon,
    color: 'text-foreground',
    bgColor: 'bg-secondary',
    borderColor: 'border-border',
  },
  meeting: {
    icon: CalendarIcon,
    color: 'text-foreground',
    bgColor: 'bg-secondary',
    borderColor: 'border-border',
  },
  initiative: {
    icon: BookmarkIcon,
    color: 'text-foreground',
    bgColor: 'bg-secondary',
    borderColor: 'border-border',
  },
  alert: {
    icon: ExclamationTriangleIcon,
    color: 'text-foreground',
    bgColor: 'bg-secondary',
    borderColor: 'border-border',
  },
  insight: {
    icon: LightningBoltIcon,
    color: 'text-foreground',
    bgColor: 'bg-secondary',
    borderColor: 'border-border',
  },
};

const priorityIndicator: Record<BriefingCardType['priority'], string> = {
  high: 'bg-foreground',
  medium: 'bg-muted-foreground',
  low: 'bg-muted',
};

export function BriefingCard({ card, className }: BriefingCardProps) {
  const config = typeConfig[card.type];
  const Icon = config.icon;

  const content = (
    <Card 
      className={cn(
        "relative overflow-hidden hover:shadow-sm hover:border-navy/20 transition-all",
        className
      )}
    >
      {/* Priority indicator */}
      <div className={cn(
        "absolute top-0 left-0 w-1 h-full",
        priorityIndicator[card.priority]
      )} />

      <CardContent className="p-4 pl-5">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
            config.bgColor,
            config.color
          )}>
            <Icon className="w-5 h-5" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-foreground mb-0.5">
              {card.title}
            </h3>
            <p className="text-sm text-muted-foreground">
              {card.subtitle}
            </p>
          </div>

          {/* Value or Action */}
          <div className="flex flex-col items-end gap-1">
            {card.value && (
              <span className="text-sm font-semibold text-foreground tabular-nums">
                {card.value}
              </span>
            )}
            {card.action && (
              <span className={cn(
                "text-xs font-medium flex items-center gap-1",
                config.color
              )}>
                {card.action}
                <ChevronRightIcon className="w-3 h-3" />
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (card.link) {
    return (
      <Link href={card.link} className="block">
        {content}
      </Link>
    );
  }

  return content;
}

interface BriefingCardsGridProps {
  cards: BriefingCardType[];
  className?: string;
}

export function BriefingCardsGrid({ cards, className }: BriefingCardsGridProps) {
  return (
    <div className={cn("grid gap-3", className)}>
      {cards.map((card) => (
        <BriefingCard key={card.id} card={card} />
      ))}
    </div>
  );
}
