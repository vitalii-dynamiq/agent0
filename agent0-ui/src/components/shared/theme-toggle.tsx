'use client';

import { useEffect, useSyncExternalStore } from 'react';
import { MoonIcon, SunIcon } from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type ThemeMode = 'light' | 'dark';

const STORAGE_KEY = 'agent0-theme';
const THEME_EVENT = 'agent0-theme-change';

const getSnapshot = (): ThemeMode => {
  // Default to dark mode for Agent-0
  if (typeof window === 'undefined') return 'dark';
  const stored = window.localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
  // Only return light if explicitly set, otherwise default to dark
  return stored === 'light' ? 'light' : 'dark';
};

const subscribe = (callback: () => void) => {
  if (typeof window === 'undefined') return () => {};
  const handler = () => callback();
  window.addEventListener('storage', handler);
  window.addEventListener(THEME_EVENT, handler);
  const media = window.matchMedia?.('(prefers-color-scheme: dark)');
  media?.addEventListener?.('change', handler);
  return () => {
    window.removeEventListener('storage', handler);
    window.removeEventListener(THEME_EVENT, handler);
    media?.removeEventListener?.('change', handler);
  };
};

export function ThemeToggle({ className }: { className?: string }) {
  const theme = useSyncExternalStore(subscribe, getSnapshot, () => 'light');

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    if (typeof window === 'undefined') return;
    const nextTheme: ThemeMode = theme === 'dark' ? 'light' : 'dark';
    
    // Immediately update DOM before React re-renders
    const root = document.documentElement;
    if (nextTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    window.localStorage.setItem(STORAGE_KEY, nextTheme);
    window.dispatchEvent(new Event(THEME_EVENT));
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      className={cn(
        "h-8 w-8 rounded-md bg-secondary text-foreground hover:bg-accent/70",
        className
      )}
    >
      {theme === 'dark' ? (
        <SunIcon className="w-3.5 h-3.5" />
      ) : (
        <MoonIcon className="w-3.5 h-3.5" />
      )}
    </Button>
  );
}
