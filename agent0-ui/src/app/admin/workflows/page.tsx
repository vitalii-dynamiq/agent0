'use client';

import { useState, useRef } from 'react';
import { workflows } from '@/lib/mock-data';
import { Workflow } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import {
  MixerVerticalIcon,
  ClockIcon,
  CopyIcon,
  PlusIcon,
} from '@radix-ui/react-icons';

const defaultDocument = `# Decision matrix

## Level 1 — Auto-execute
• Value < AED 250K and low reputational risk.
• Precedent match > 80% and no cross-entity impact.
• Routing: Execution team with PMO oversight.

## Level 2 — Human review
• Value AED 250K–25M or medium cross-entity impact.
• PMO Office review required before execution.
• Routing: PMO + Chairman Office approval queue.

## Level 3 — Executive decision
• Value > AED 25M or high reputational exposure.
• Policy escalation required for strategic alignment.
• Routing: Chairman decision with ADEO evaluation notes.

---

## Escalation notes
• Any cross-entity policy conflict triggers immediate escalation.
• Override decisions must include rationale and stakeholder impacts.
• Audit trail must capture sources, precedent alignment, and approval history.
`;

const versionHistory = [
  { version: '3.0', date: '2026-01-19', author: 'Sara Al Nuaimi', current: true },
  { version: '2.5', date: '2026-01-10', author: 'Sara Al Nuaimi', current: false },
  { version: '2.0', date: '2025-12-15', author: 'Ahmed Hassan', current: false },
];

// Parse document into rendered HTML with Notion-like styling
function parseToHtml(text: string): string {
  const lines = text.split('\n');
  let html = '';
  
  for (const line of lines) {
    const trimmed = line;
    
    if (trimmed === '---' || trimmed === '***' || trimmed === '___') {
      html += '<div class="notion-divider"><hr /></div>';
    } else if (trimmed.startsWith('# ')) {
      html += `<h1 class="notion-h1">${escapeHtml(trimmed.slice(2))}</h1>`;
    } else if (trimmed.startsWith('## ')) {
      html += `<h2 class="notion-h2">${escapeHtml(trimmed.slice(3))}</h2>`;
    } else if (trimmed.startsWith('### ')) {
      html += `<h3 class="notion-h3">${escapeHtml(trimmed.slice(4))}</h3>`;
    } else if (trimmed.startsWith('• ') || trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      html += `<div class="notion-bullet"><span class="bullet-marker">•</span><span>${escapeHtml(trimmed.slice(2))}</span></div>`;
    } else if (trimmed === '') {
      html += '<div class="notion-empty"><br /></div>';
    } else {
      html += `<div class="notion-paragraph">${escapeHtml(trimmed)}</div>`;
    }
  }
  
  return html;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export default function WorkflowsPage() {
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(workflows[0]);
  const [content] = useState(defaultDocument);
  const editorRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)]">
      {/* Workflow List Sidebar */}
      <div className="w-full lg:w-72 border-b lg:border-b-0 lg:border-r border-border bg-card flex flex-col max-h-48 lg:max-h-none overflow-hidden min-h-0">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Decision Policies</h3>
            <Button size="sm" variant="outline" className="h-8">
              <PlusIcon className="w-4 h-4 mr-1" />
              New
            </Button>
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">
            Decision matrices and routing logic that define agent behavior.
          </p>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {workflows.map((workflow) => (
              <Button
                key={workflow.id}
                type="button"
                variant="ghost"
                onClick={() => setSelectedWorkflow(workflow)}
                className={cn(
                  "w-full h-auto p-3 rounded-lg transition-colors text-left border justify-start items-start",
                  selectedWorkflow?.id === workflow.id
                    ? "bg-primary/5 border-primary/30"
                    : "hover:bg-muted border-transparent"
                )}
              >
                <div className="flex items-start gap-2 w-full min-w-0">
                  <MixerVerticalIcon className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-foreground text-sm truncate">{workflow.name}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2">{workflow.description}</p>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[10px] mt-2 inline-flex",
                        workflow.isActive
                          ? "bg-primary/10 text-primary border-primary/20"
                          : "bg-secondary text-muted-foreground border-border"
                      )}
                    >
                      {workflow.isActive ? 'Active' : 'Draft'}
                    </Badge>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {selectedWorkflow ? (
          <div className="max-w-6xl mx-auto px-6 py-6 space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-wrap">
                <Input
                  defaultValue={selectedWorkflow.name}
                  className="h-9 max-w-md font-semibold text-foreground"
                />
                <Badge variant="outline" className="text-[11px] bg-secondary text-muted-foreground border-border">
                  Policy pack
                </Badge>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Button variant="outline" size="sm" shape="squared">
                  <CopyIcon className="w-4 h-4 mr-1" />
                  Duplicate
                </Button>
                <Button
                  size="sm"
                  shape="squared"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  disabled={selectedWorkflow.isActive}
                >
                  {selectedWorkflow.isActive ? 'Published' : 'Publish'}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[1.65fr_0.95fr] gap-6">
              <div className="space-y-6">
                <div
                  ref={editorRef}
                  className="notion-document-editor rounded-xl border border-border bg-card min-h-[520px] transition-colors focus-within:border-primary/40 focus-within:ring-1 focus-within:ring-primary/20"
                >
                  <div
                    className="notion-rendered p-6"
                    contentEditable
                    suppressContentEditableWarning
                    dangerouslySetInnerHTML={{ __html: parseToHtml(content) }}
                  />
                </div>
              </div>

              <div className="space-y-6">
                <Card className="border-border/60">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <ClockIcon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <CardTitle className="text-[14px] font-semibold">Revision history</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {versionHistory.map((version) => (
                      <div
                        key={version.version}
                        className={cn(
                          "rounded-lg border p-3 text-[12px] transition-colors",
                          version.current
                            ? "bg-primary/5 border-primary/20"
                            : "bg-card border-border"
                        )}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-medium text-foreground">v{version.version}</span>
                          {version.current && (
                            <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px]">
                              Current
                            </Badge>
                          )}
                        </div>
                        <p className="text-muted-foreground">{version.date}</p>
                        <p className="text-muted-foreground">by {version.author}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>

              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <MixerVerticalIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Select a policy pack to view details</p>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        .notion-rendered {
          font-family: var(--font-geist-sans), system-ui, sans-serif;
          outline: none;
          min-height: 480px;
        }
        
        .notion-rendered:focus {
          outline: none;
        }
        
        .notion-h1 {
          font-size: 1.875rem;
          font-weight: 700;
          color: var(--foreground);
          margin: 1.5rem 0 0.75rem 0;
          line-height: 1.2;
          letter-spacing: -0.02em;
        }
        
        .notion-h1:first-child {
          margin-top: 0;
        }
        
        .notion-h2 {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--foreground);
          margin: 1.25rem 0 0.5rem 0;
          line-height: 1.3;
          letter-spacing: -0.01em;
        }
        
        .notion-h3 {
          font-size: 1rem;
          font-weight: 600;
          color: var(--foreground);
          margin: 1rem 0 0.375rem 0;
          line-height: 1.4;
        }
        
        .notion-paragraph {
          font-size: 0.875rem;
          color: var(--foreground);
          opacity: 0.9;
          margin: 0.25rem 0;
          line-height: 1.7;
        }
        
        .notion-bullet {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          font-size: 0.875rem;
          color: var(--foreground);
          opacity: 0.9;
          margin: 0.375rem 0;
          line-height: 1.7;
          padding-left: 0.25rem;
        }
        
        .notion-bullet .bullet-marker {
          color: var(--muted-foreground);
          flex-shrink: 0;
          user-select: none;
        }
        
        .notion-divider {
          margin: 1.75rem 0;
        }
        
        .notion-divider hr {
          border: none;
          height: 1px;
          background: var(--border);
        }
        
        .notion-empty {
          height: 1.25rem;
        }
        
        /* Selection styling */
        .notion-rendered ::selection {
          background: var(--primary);
          color: var(--primary-foreground);
        }
      `}</style>
    </div>
  );
}
