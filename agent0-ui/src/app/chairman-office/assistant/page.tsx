'use client';

import { ExecutiveAssistantChat } from '@/components/shared/executive-assistant-chat';

export default function ChairmansOfficeAssistant() {
  return (
    <div className="min-h-[calc(100vh-56px)] bg-background">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 py-4 sm:py-10">
        <section className="border border-border rounded-xl sm:rounded-2xl bg-card shadow-sm p-3 sm:p-6 min-h-[calc(100vh-120px)] sm:min-h-[72vh] flex flex-col">
          <ExecutiveAssistantChat basePath="/chairman-office" />
        </section>
      </div>
    </div>
  );
}
