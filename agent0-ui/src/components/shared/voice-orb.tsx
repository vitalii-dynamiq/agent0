'use client';

import { ChatBubbleIcon } from '@radix-ui/react-icons';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface VoiceOrbProps {
  onClick?: () => void;
  className?: string;
}

// Simplified to a button instead of animated orb
export function VoiceOrb({ 
  onClick,
  className 
}: VoiceOrbProps) {
  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      <Button
        onClick={onClick}
        size="lg"
        className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
      >
        <ChatBubbleIcon className="w-5 h-5" />
        Ask Agent-0
      </Button>
      <p className="text-sm text-muted-foreground">
        Get instant briefings and insights
      </p>
    </div>
  );
}

interface VoiceOrbMiniProps {
  onClick?: () => void;
  className?: string;
}

export function VoiceOrbMini({ onClick, className }: VoiceOrbMiniProps) {
  return (
    <Button
      onClick={onClick}
      variant="outline"
      size="sm"
      className={cn("gap-2", className)}
    >
      <ChatBubbleIcon className="w-4 h-4" />
      Ask
    </Button>
  );
}
