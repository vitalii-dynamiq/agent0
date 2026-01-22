'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ArrowRightIcon } from '@radix-ui/react-icons';
import { ThemeToggle } from '@/components/shared/theme-toggle';

// Dynamically import the 3D component to avoid SSR issues
const MetallicBackground = dynamic(
  () => import('@/components/shared/metallic-shape').then((mod) => mod.MetallicBackground),
  { ssr: false }
);

const personas = [
  {
    id: 'chairman',
    title: 'Chairman',
    subtitle: 'Conversation',
    description: 'Chat-first briefings and decision drill-downs',
    href: '/chairman',
  },
  {
    id: 'chairman-office',
    title: "Chairman's Office",
    subtitle: 'Executive Staff',
    description: 'Decision prep, meeting intelligence, and executive briefing dashboard',
    href: '/chairman-office',
  },
  {
    id: 'pmo',
    title: 'PMO Office',
    subtitle: 'Program Management',
    description: 'Pipeline management and analytics',
    href: '/operations',
  },
  {
    id: 'admin',
    title: 'Agent-0 Admin',
    subtitle: 'Administration',
    description: 'Knowledge graph, workflows, audit trail, and integrations',
    href: '/admin',
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Metallic 3D Background Element */}
      <div className="absolute -right-[5vw] top-1/2 -translate-y-1/2 w-[45vw] h-[70vh]">
        {/* Radial glow behind 3D element */}
        <div className="absolute inset-0 bg-gradient-radial from-purple-500/10 via-transparent to-transparent dark:from-purple-500/20 blur-3xl" />
        <div className="w-full h-full opacity-35 dark:opacity-55">
          <Suspense fallback={null}>
            <MetallicBackground className="w-full h-full" />
          </Suspense>
        </div>
      </div>
      
      <div className="absolute top-6 right-6 z-10">
        <ThemeToggle />
      </div>
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-32 relative z-10">
        <div className="max-w-2xl w-full">
          {/* Header - Futurist typography */}
          <div className="text-center mb-24">
            <h1 className="text-display text-foreground mb-5">
              Agent<span className="text-emphasis">-</span>0
            </h1>
            <p className="text-[15px] text-muted-foreground tracking-wide">
              Executive Decision Support Platform
            </p>
          </div>

          {/* Persona Cards - Improved spacing and radius */}
          <div className="space-y-5">
            {personas.map((persona, index) => (
              <Link 
                key={persona.id} 
                href={persona.href}
                className="group block animate-slide-up"
                style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}
              >
                <div className="flex items-center justify-between py-7 px-7 border border-border rounded-2xl transition-all duration-300 hover:border-foreground/30 card-glow bg-card">
                  <div>
                    <div className="flex items-baseline gap-3">
                      <span className="text-[16px] font-semibold text-foreground tracking-tight">
                        {persona.title}
                      </span>
                      <span className="text-nav text-muted-foreground">
                        {persona.subtitle}
                      </span>
                    </div>
                    <p className="text-[13px] text-muted-foreground mt-2 leading-relaxed">
                      {persona.description}
                    </p>
                  </div>
                  
                  <span className="flex items-center gap-1 text-muted-foreground group-hover:text-foreground group-hover:gap-2 transition-all">
                    <ArrowRightIcon className="size-5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
