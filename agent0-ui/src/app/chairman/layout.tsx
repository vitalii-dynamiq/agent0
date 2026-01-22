'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/shared/theme-toggle';
import { ProfileMenu } from '@/components/shared/profile-menu';
import { Button } from '@/components/ui/button';
import {
  ChatBubbleIcon,
  CheckCircledIcon,
  CalendarIcon,
} from '@radix-ui/react-icons';

export default function ChairmanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { href: '/chairman', label: 'Assistant', active: pathname === '/chairman', icon: ChatBubbleIcon },
    { href: '/chairman/decisions', label: 'Decisions', active: pathname?.includes('/chairman/decision'), icon: CheckCircledIcon },
    { href: '/chairman/meetings', label: 'Meetings', active: pathname?.includes('/chairman/meeting'), icon: CalendarIcon },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background border-b border-border sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          {/* Left - Back & Logo */}
          <div className="flex items-center gap-3">
            <Link 
              href="/"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.85355 3.14645C7.04882 3.34171 7.04882 3.65829 6.85355 3.85355L3.70711 7H12.5C12.7761 7 13 7.22386 13 7.5C13 7.77614 12.7761 8 12.5 8H3.70711L6.85355 11.1464C7.04882 11.3417 7.04882 11.6583 6.85355 11.8536C6.65829 12.0488 6.34171 12.0488 6.14645 11.8536L2.14645 7.85355C1.95118 7.65829 1.95118 7.34171 2.14645 7.14645L6.14645 3.14645C6.34171 2.95118 6.65829 2.95118 6.85355 3.14645Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"/>
              </svg>
            </Link>
            <span className="text-[14px] font-semibold tracking-tight">Agent<span className="text-emphasis">-</span>0</span>
          </div>

          {/* Center - Navigation (Desktop) - Futurist ALL CAPS with icons */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "nav-futurist flex items-center gap-1.5",
                  item.active && "active"
                )}
              >
                <item.icon className="size-3.5" />
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right - Profile & Menu */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <ProfileMenu name="H.E. Chairman" role="Chairman" initials="CH" />

            {/* Mobile Menu Button */}
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-[13px] text-muted-foreground"
            >
              {mobileMenuOpen ? '×' : '☰'}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-background">
            <nav className="px-6 py-4 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "nav-sidebar-futurist",
                    item.active && "active"
                  )}
                >
                  <item.icon className="size-4" />
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* Content */}
      <main>
        {children}
      </main>
    </div>
  );
}
