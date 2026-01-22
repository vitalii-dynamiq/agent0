'use client';

import { useState, useRef, useEffect } from 'react';
import { AIMessage } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { ChatBubbleIcon, PersonIcon, PaperPlaneIcon, SpeakerLoudIcon, StopIcon, UploadIcon, Cross2Icon, FileTextIcon } from '@radix-ui/react-icons';

interface AIChatPrompt {
  id: string;
  label: string;
  prompt: string;
}

interface AIChatProps {
  messages: AIMessage[];
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  className?: string;
  quickPrompts?: AIChatPrompt[];
  showVoice?: boolean;
  isRecording?: boolean;
  onToggleRecording?: () => void;
  enableAttachments?: boolean;
  emptyState?: React.ReactNode;
  renderMessageWidget?: (message: AIMessage) => React.ReactNode;
}

export function AIChat({ 
  messages, 
  onSendMessage, 
  isLoading = false,
  placeholder = "Ask Agent-0 anything...",
  className,
  quickPrompts = [],
  showVoice = false,
  isRecording = false,
  onToggleRecording,
  enableAttachments = false,
  emptyState,
  renderMessageWidget
}: AIChatProps) {
  const [input, setInput] = useState('');
  const endRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [attachments, setAttachments] = useState<Array<{ id: string; name: string; sizeLabel: string }>>([]);
  const [recordingElapsed, setRecordingElapsed] = useState(0);

  useEffect(() => {
    if (messages.length > 0) {
      endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [messages]);

  useEffect(() => {
    if (!isRecording) {
      setRecordingElapsed(0);
      return;
    }
    const startedAt = Date.now();
    const timer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startedAt) / 1000);
      setRecordingElapsed(elapsed);
    }, 500);
    return () => clearInterval(timer);
  }, [isRecording]);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleAttach = () => {
    fileInputRef.current?.click();
  };

  const handleFilesSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) return;
    const next = files.map((file) => ({
      id: `${file.name}-${file.size}-${file.lastModified}`,
      name: file.name,
      sizeLabel: formatSize(file.size),
    }));
    setAttachments((prev) => [...prev, ...next]);
    event.target.value = '';
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const hasAttachments = attachments.length > 0;
    if ((input.trim() || hasAttachments) && !isLoading) {
      const attachmentSummary = hasAttachments
        ? `\n\nAttachments: ${attachments.map((item) => item.name).join(', ')}`
        : '';
      const message = `${input.trim() || 'Sent attachment(s).'}${attachmentSummary}`;
      onSendMessage(message.trim());
      setInput('');
      setAttachments([]);
    }
  };

  const handlePromptClick = (prompt: AIChatPrompt) => {
    if (!isLoading) {
      onSendMessage(prompt.prompt);
    }
  };

  const formatElapsed = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = String(seconds % 60).padStart(2, '0');
    return `${mins}:${secs}`;
  };

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Messages */}
      <ScrollArea className="flex-1 pr-4">
        <div className="space-y-4 py-4">
          {messages.length === 0 && emptyState && (
            <div className="space-y-6">{emptyState}</div>
          )}
          {messages.map((message) => {
            const widget = renderMessageWidget ? renderMessageWidget(message) : null;
            return (
              <div
                key={message.id}
                className={cn(
                  "flex gap-3",
                  message.role === 'user' && "flex-row-reverse"
                )}
              >
                {/* Avatar */}
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                  message.role === 'assistant' 
                    ? "bg-foreground text-background"
                    : "bg-muted text-muted-foreground"
                )}>
                  {message.role === 'assistant' ? (
                    <ChatBubbleIcon className="w-4 h-4" />
                  ) : (
                    <PersonIcon className="w-4 h-4" />
                  )}
                </div>

                {/* Message */}
                <div className={cn(
                  "flex-1 max-w-[90%]",
                  message.role === 'user' && "text-right"
                )}>
                  <div className={cn(
                    "inline-block px-4 py-2.5 rounded-lg text-sm whitespace-pre-wrap leading-relaxed",
                    message.role === 'assistant'
                      ? "bg-secondary text-foreground border border-border rounded-tl-none"
                      : "bg-primary/10 text-foreground border border-primary/20 rounded-tr-none"
                  )}>
                    {message.content}
                  </div>
                  {widget && message.role === 'assistant' && (
                    <div className="mt-3">{widget}</div>
                  )}
                  <p className="text-xs text-muted-foreground mt-1 px-1">
                    {new Date(message.timestamp).toLocaleTimeString('en-AE', {
                      hour: 'numeric',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            );
          })}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center">
                <ChatBubbleIcon className="w-4 h-4" />
              </div>
              <div className="bg-muted rounded-lg rounded-tl-none px-4 py-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-muted-foreground rounded-full opacity-50" />
                  <span className="w-2 h-2 bg-muted-foreground rounded-full opacity-50" />
                  <span className="w-2 h-2 bg-muted-foreground rounded-full opacity-50" />
                </div>
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <form onSubmit={handleSubmit} className="pt-3 sm:pt-4 border-t border-border">
        {showVoice && isRecording && (
          <div className="mb-3 rounded-lg border border-border bg-secondary/40 p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                <span className="text-[12px] font-medium text-foreground">Recording in progress</span>
              </div>
              <span className="text-[11px] text-muted-foreground tabular-nums">
                {formatElapsed(recordingElapsed)}
              </span>
            </div>
            <div className="mt-2 flex items-end gap-1">
              {[6, 14, 9, 16, 10, 18, 8].map((height, index) => (
                <span
                  key={index}
                  className="w-1.5 rounded-full bg-primary/80 animate-pulse"
                  style={{ height: `${height}px`, animationDelay: `${index * 80}ms` }}
                />
              ))}
              <span className="ml-2 text-[11px] text-muted-foreground">Tap stop to send</span>
            </div>
          </div>
        )}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {enableAttachments && (
            <>
              <Button
                type="button"
                variant="secondary"
                size="icon"
                shape="squared"
                onClick={handleAttach}
                className="h-11 w-11 sm:h-9 sm:w-9 flex-shrink-0"
              >
                <UploadIcon className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={handleFilesSelected}
              />
            </>
          )}
          {showVoice && (
            <Button
              type="button"
              size="icon"
              shape="squared"
              onClick={onToggleRecording}
              className={cn(
                "h-11 w-11 sm:h-9 sm:w-9 border border-border flex-shrink-0",
                isRecording
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "bg-secondary text-foreground hover:bg-accent"
              )}
            >
              {isRecording ? (
                <StopIcon className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
              ) : (
                <SpeakerLoudIcon className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
              )}
            </Button>
          )}
          <div className="flex-1 relative min-w-0">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={placeholder}
              disabled={isLoading}
              className="pr-12 h-11 sm:h-12 rounded-[4px] text-[14px] sm:text-[13px]"
            />
            <Button
              type="submit"
              size="icon"
              shape="squared"
              disabled={(!input.trim() && attachments.length === 0) || isLoading}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 h-8 w-8 sm:h-9 sm:w-9"
            >
              <PaperPlaneIcon className="w-4 h-4" />
            </Button>
          </div>
        </div>
        {attachments.length > 0 && (
          <div className="mt-3 rounded-lg border border-border bg-secondary/40 p-3">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[12px] font-medium text-foreground">Attachments ready</p>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setAttachments([])}
                className="text-[11px] text-muted-foreground"
              >
                Clear all
              </Button>
            </div>
            <div className="space-y-2">
              {attachments.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-2 rounded-md border border-border/70 bg-background px-3 py-2 text-[11px] text-foreground"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <FileTextIcon className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="truncate max-w-[200px]">{item.name}</span>
                    <span className="text-muted-foreground">{item.sizeLabel}</span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => handleRemoveAttachment(item.id)}
                    className="h-6 w-6 text-muted-foreground hover:text-foreground"
                  >
                    <Cross2Icon className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
        {quickPrompts.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5 sm:gap-2 max-h-[120px] sm:max-h-none overflow-y-auto sm:overflow-visible">
            {quickPrompts.map((prompt) => (
              <Button
                key={prompt.id}
                type="button"
                onClick={() => handlePromptClick(prompt)}
                disabled={isLoading}
                variant="outline"
                size="sm"
                className={cn(
                  "rounded-full px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-[12px]",
                  "bg-background hover:bg-accent/60",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              >
                {prompt.label}
              </Button>
            ))}
          </div>
        )}
      </form>
    </div>
  );
}

// Simplified chat for sidebar use
interface AIChatSidebarProps {
  className?: string;
}

export function AIChatSidebar({ className }: AIChatSidebarProps) {
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m Agent-0, your AI assistant. How can I help you today?',
      timestamp: new Date().toISOString(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = (content: string) => {
    const userMessage: AIMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "I've analyzed the data and here's what I found...",
        "Based on the current decision pipeline, I recommend prioritizing the TAMM 5.0 initiative.",
        "The stakeholder analysis shows strong support for this initiative.",
        "I can help you draft a summary for the Chairman's review.",
        "Let me check the knowledge base for relevant precedents...",
      ];
      const aiMessage: AIMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className={cn("flex flex-col h-full bg-card rounded-lg border border-border p-4", className)}>
      <div className="flex items-center gap-2 pb-3 border-b border-border mb-3">
        <div className="w-8 h-8 rounded-full bg-foreground flex items-center justify-center">
          <ChatBubbleIcon className="w-4 h-4 text-background" />
        </div>
        <div>
          <h4 className="font-medium text-sm">Agent<span className="text-emphasis">-</span>0</h4>
          <p className="text-xs text-muted-foreground">AI Assistant</p>
        </div>
      </div>
      <AIChat
        messages={messages}
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        placeholder="Ask a question..."
      />
    </div>
  );
}
