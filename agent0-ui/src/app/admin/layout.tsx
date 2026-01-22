'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/shared/theme-toggle';
import { ProfileMenu } from '@/components/shared/profile-menu';
import { Button } from '@/components/ui/button';
import {
  DashboardIcon,
  Link2Icon,
  MixIcon,
  Share2Icon,
  ReaderIcon,
  FileTextIcon,
  CalendarIcon,
  CheckCircledIcon,
} from '@radix-ui/react-icons';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { href: '/admin', label: 'Overview', match: (p: string) => p === '/admin', icon: DashboardIcon },
    { href: '/admin/knowledge', label: 'Knowledge Graph', match: (p: string) => p.includes('/knowledge'), icon: Share2Icon },
    { href: '/admin/meetings', label: 'Meeting Intelligence', match: (p: string) => p.includes('/meetings'), icon: CalendarIcon },
    { href: '/admin/commitments', label: 'Commitments', match: (p: string) => p.includes('/commitments'), icon: CheckCircledIcon },
    { href: '/admin/policies', label: 'Policies', match: (p: string) => p.includes('/policies'), icon: FileTextIcon },
    { href: '/admin/workflows', label: 'Decision Engine Workflows', match: (p: string) => p.includes('/workflows'), icon: MixIcon },
    { href: '/admin/audit', label: 'Decision Audit Trail', match: (p: string) => p.includes('/audit'), icon: ReaderIcon },
    { href: '/admin/integrations', label: 'Integrations', match: (p: string) => p.includes('/integrations'), icon: Link2Icon },
  ];

  const getPageTitle = () => {
    if (pathname === '/admin') return 'System Overview';
    if (pathname?.includes('/knowledge')) return 'Enterprise Knowledge Graph';
    if (pathname?.includes('/meetings')) return 'Meeting Intelligence';
    if (pathname?.includes('/commitments')) return 'Commitments';
    if (pathname?.includes('/policies')) return 'Policies';
    if (pathname?.includes('/workflows')) return 'Decision Engine Workflows';
    if (pathname?.includes('/audit')) return 'Decision Audit Trail';
    if (pathname?.includes('/integrations')) return 'Integrations';
    return 'Agent-0 Admin';
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 bottom-0 w-56 bg-background border-r border-border flex flex-col z-50 overflow-hidden",
        "transform transition-transform duration-150 ease-out",
        "lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Header */}
        <div className="p-4 border-b border-border">
          <Link
            href="/"
            className="text-[13px] text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setSidebarOpen(false)}
          >
            ← Back
          </Link>
          <div className="flex items-center gap-2 mt-4">
            <h1 className="text-[14px] font-medium">Agent<span className="text-emphasis">-</span>0</h1>
          </div>
        </div>

        {/* Navigation - Futurist sidebar style */}
        <nav className="flex-1 p-3">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "nav-sidebar-futurist",
                    item.match(pathname || '') && "active"
                  )}
                >
                  <item.icon className="size-4" />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

      </aside>

      {/* Main Content */}
      <div className="lg:ml-56 min-h-screen flex flex-col">
        {/* Header */}
        <header className="bg-background border-b border-border sticky top-0 z-30">
          <div className="px-6 h-14 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-[13px] text-muted-foreground"
              >
                ☰
              </Button>
              <h2 className="text-[15px] font-medium">
                {getPageTitle()}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <ProfileMenu name="Sara Al Nuaimi" role="Agent-0 Admin" initials="SN" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
