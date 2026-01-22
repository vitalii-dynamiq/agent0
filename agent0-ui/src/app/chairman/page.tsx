'use client';

import { ExecutiveAssistantChat } from '@/components/shared/executive-assistant-chat';

// Simple CSS-based AI indicator orb
function AIIndicator() {
  return (
    <div className="relative w-7 h-7 flex-shrink-0">
      {/* Outer glow ring */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-400/30 to-purple-500/30 blur-sm animate-pulse" />
      {/* Main orb */}
      <div className="absolute inset-0.5 rounded-full bg-gradient-to-br from-slate-200 to-slate-400 dark:from-slate-400 dark:to-slate-600 shadow-inner" />
      {/* Inner highlight */}
      <div className="absolute inset-1.5 rounded-full bg-gradient-to-br from-white/60 to-transparent dark:from-white/40" />
      {/* Core dot */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-cyan-400 dark:bg-cyan-300 shadow-sm" />
    </div>
  );
}

export default function ChairmanConversation() {
  return (
    <div className="min-h-[calc(100vh-56px)] bg-background">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <section className="border border-border rounded-2xl bg-card shadow-sm p-6 min-h-[72vh] flex flex-col">
          {/* Header with AI indicator */}
          <div className="flex items-center gap-3 pb-4 border-b border-border/50">
            <AIIndicator />
            <div className="flex-1">
              <h1 className="text-sm font-semibold text-foreground">Executive Assistant</h1>
              <p className="text-xs text-muted-foreground">AI-powered briefings & actions</p>
            </div>
          </div>
          <div className="flex-1 flex flex-col mt-4">
            <ExecutiveAssistantChat basePath="/chairman" hideHeader />
          </div>
        </section>
      </div>
    </div>
  );
}
