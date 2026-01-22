'use client';
import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface ProfileMenuProps {
  name: string;
  role?: string;
  initials: string;
  className?: string;
}

export function ProfileMenu({ name, role, initials, className }: ProfileMenuProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        type="button"
        variant="outline"
        size="icon"
        aria-label="Open profile menu"
        className={cn(
          "h-8 w-8 rounded-full bg-secondary hover:bg-accent",
          className
        )}
      >
        <Avatar className="h-8 w-8">
          <AvatarFallback className="text-[11px] font-medium text-foreground bg-secondary">
            {initials}
          </AvatarFallback>
        </Avatar>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label="Open profile menu"
          className={cn(
            "h-8 w-8 rounded-full bg-secondary hover:bg-accent",
            className
          )}
        >
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-[11px] font-medium text-foreground bg-secondary">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-2 py-1.5">
          <p className="text-[13px] font-medium text-foreground">{name}</p>
          {role && <p className="text-[11px] text-muted-foreground">{role}</p>}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Account settings</DropdownMenuItem>
        <DropdownMenuItem>Security</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive focus:text-destructive">
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
