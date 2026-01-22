'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { meetings, getStakeholderById } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';

const statusStyles: Record<string, string> = {
  pending: 'bg-secondary text-muted-foreground border-border',
  in_progress: 'bg-primary/10 text-primary border-primary/20',
  completed: 'bg-success/10 text-success border-success/20',
};

export default function AdminCommitmentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'in_progress' | 'completed'>('all');

  const commitments = useMemo(() => {
    return meetings.flatMap((meeting) =>
      (meeting.actionItems || []).map((item) => ({
        ...item,
        meetingTitle: meeting.title,
        meetingDate: meeting.date,
      }))
    );
  }, []);

  const [selectedCommitmentId, setSelectedCommitmentId] = useState<string | null>(() => commitments[0]?.id ?? null);

  const filtered = useMemo(() => {
    let items = commitments;
    if (statusFilter !== 'all') {
      items = items.filter((item) => item.status === statusFilter);
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      items = items.filter((item) =>
        item.description.toLowerCase().includes(query) ||
        item.meetingTitle.toLowerCase().includes(query)
      );
    }
    return items;
  }, [commitments, statusFilter, searchQuery]);

  useEffect(() => {
    if (filtered.length === 0) {
      setSelectedCommitmentId(null);
      return;
    }
    if (!selectedCommitmentId || !filtered.some((item) => item.id === selectedCommitmentId)) {
      setSelectedCommitmentId(filtered[0]?.id ?? null);
    }
  }, [filtered, selectedCommitmentId]);

  const statusCounts = useMemo(() => ({
    total: commitments.length,
    pending: commitments.filter((item) => item.status === 'pending').length,
    inProgress: commitments.filter((item) => item.status === 'in_progress').length,
    completed: commitments.filter((item) => item.status === 'completed').length,
  }), [commitments]);

  const formatAssignee = (assigneeId: string) => getStakeholderById(assigneeId)?.name || 'Unassigned';
  const selectedCommitment = filtered.find((item) => item.id === selectedCommitmentId) ?? null;

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-xl font-semibold">Commitments</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Action tracking across meeting intelligence and decision follow-ups.
        </p>
      </div>

      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        <Card className="border-border/60">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Total commitments</p>
            <p className="text-2xl font-semibold tabular-nums">{statusCounts.total}</p>
          </CardContent>
        </Card>
        <Card className="border-border/60">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Pending</p>
            <p className="text-2xl font-semibold tabular-nums">{statusCounts.pending}</p>
          </CardContent>
        </Card>
        <Card className="border-border/60">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">In progress</p>
            <p className="text-2xl font-semibold tabular-nums">{statusCounts.inProgress}</p>
          </CardContent>
        </Card>
        <Card className="border-border/60">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Completed</p>
            <p className="text-2xl font-semibold tabular-nums">{statusCounts.completed}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/60">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <CardTitle className="text-base">Commitment tracker</CardTitle>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search commitments..."
                  className="pl-9 h-9 text-[13px] w-full sm:w-56"
                />
              </div>
              <div className="flex items-center gap-1 p-1 bg-secondary rounded-lg">
                {(['all', 'pending', 'in_progress', 'completed'] as const).map((status) => (
                  <Button
                    key={status}
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setStatusFilter(status)}
                    className={cn(
                      'px-3 py-1.5 text-[12px] font-medium rounded-md transition-colors',
                      statusFilter === status
                        ? 'bg-foreground text-background hover:bg-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {status === 'all' ? 'All' : status.replace('_', ' ')}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
            {/* Commitments List */}
            <ScrollArea className="h-[500px] pr-3">
              <div className="space-y-2">
                {filtered.map((item) => (
                  <div
                    key={item.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelectedCommitmentId(item.id)}
                    onKeyDown={(e) => e.key === 'Enter' && setSelectedCommitmentId(item.id)}
                    className={cn(
                      "w-full rounded-lg border p-3 text-left cursor-pointer transition-colors",
                      selectedCommitmentId === item.id
                        ? "border-primary/40 bg-primary/5"
                        : "border-border/70 hover:bg-secondary/50"
                    )}
                  >
                    {/* Top row: Description + Status */}
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-[13px] text-foreground flex-1 min-w-0 leading-snug">
                        {item.description}
                      </p>
                      <Badge
                        variant="outline"
                        className={cn('text-[10px] uppercase tracking-wide flex-shrink-0', statusStyles[item.status])}
                      >
                        {item.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    
                    {/* Meta row */}
                    <div className="flex items-center justify-between gap-2 mt-2 text-[11px] text-muted-foreground">
                      <span className="truncate">
                        {item.meetingTitle} · {new Date(item.meetingDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                      <span className="flex-shrink-0">
                        Due {new Date(item.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>

                    {/* Assignee row */}
                    <div className="text-[11px] text-muted-foreground mt-1.5">
                      Assignee: {formatAssignee(item.assigneeId)}
                    </div>
                  </div>
                ))}
                {filtered.length === 0 && (
                  <p className="text-sm text-muted-foreground py-8 text-center">No commitments match the current filters.</p>
                )}
              </div>
            </ScrollArea>

            {/* Detail Panel */}
            <div className="rounded-lg border border-border/60 bg-secondary/20 p-4 h-fit lg:sticky lg:top-4">
              {selectedCommitment ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Commitment detail</p>
                    <h3 className="text-[14px] font-semibold mt-1 text-foreground leading-snug">
                      {selectedCommitment.description}
                    </h3>
                    <p className="text-[12px] text-muted-foreground mt-2">
                      {selectedCommitment.meetingTitle} · {new Date(selectedCommitment.meetingDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                    </p>
                  </div>

                  <div className="space-y-2 text-[12px]">
                    <div className="flex items-center justify-between py-1.5 border-b border-border/50">
                      <span className="text-muted-foreground">Status</span>
                      <Badge
                        variant="outline"
                        className={cn('text-[10px] uppercase tracking-wide', statusStyles[selectedCommitment.status])}
                      >
                        {selectedCommitment.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between py-1.5 border-b border-border/50">
                      <span className="text-muted-foreground">Assignee</span>
                      <span className="text-foreground">{formatAssignee(selectedCommitment.assigneeId)}</span>
                    </div>
                    <div className="flex items-center justify-between py-1.5">
                      <span className="text-muted-foreground">Due date</span>
                      <span className="text-foreground">
                        {new Date(selectedCommitment.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 pt-2">
                    <Button asChild size="sm" variant="outline" className="w-full">
                      <Link href="/admin/meetings">Open meeting intelligence</Link>
                    </Button>
                    <Button size="sm" variant="ghost" className="w-full">
                      Mark reviewed
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">Select a commitment to review details.</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
