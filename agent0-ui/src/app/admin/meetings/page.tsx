'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { meetings, getStakeholderById } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import {
  CalendarIcon,
  ClockIcon,
  MagnifyingGlassIcon,
  PlayIcon,
  FileTextIcon,
} from '@radix-ui/react-icons';

export default function AdminMeetingsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMeetingId, setSelectedMeetingId] = useState(meetings[0]?.id ?? '');
  const [activeTab, setActiveTab] = useState('summary');

  const filteredMeetings = useMemo(() => {
    if (!searchQuery) return meetings;
    const query = searchQuery.toLowerCase();
    return meetings.filter((meeting) =>
      meeting.title.toLowerCase().includes(query) ||
      meeting.location?.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const selectedMeeting = filteredMeetings.find((meeting) => meeting.id === selectedMeetingId) ?? filteredMeetings[0];

  const commitmentItems = useMemo(() => {
    return meetings.flatMap((meeting) =>
      (meeting.actionItems || []).map((item) => ({
        ...item,
        meetingTitle: meeting.title,
        meetingDate: meeting.date,
      }))
    );
  }, []);

  const openCommitments = commitmentItems.filter((item) => item.status !== 'completed');

  const actionStatusStyles: Record<string, string> = {
    pending: 'bg-secondary text-muted-foreground border-border',
    in_progress: 'bg-primary/10 text-primary border-primary/20',
    completed: 'bg-success/10 text-success border-success/20',
  };

  const formatAssignee = (assigneeId: string) => getStakeholderById(assigneeId)?.name || 'Unassigned';

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold">Meeting Intelligence</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Transcripts, recordings, and follow-up summaries for executive meetings.
          </p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/admin/commitments">View commitments</Link>
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <Card className="lg:w-[360px] border-border/60">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Meetings</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search meetings..."
                className="pl-9"
              />
            </div>

            <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
              {filteredMeetings.map((meeting) => (
                <Button
                  key={meeting.id}
                  type="button"
                  variant="ghost"
                  onClick={() => setSelectedMeetingId(meeting.id)}
                  className={cn(
                    "w-full h-auto text-left p-3 rounded-lg border transition-colors justify-start items-start",
                    meeting.id === selectedMeeting?.id
                      ? "border-primary/30 bg-accent"
                      : "border-border hover:bg-secondary/50"
                  )}
                >
                  <div className="w-full space-y-2">
                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                      <span>{meeting.time}</span>
                      <span>·</span>
                      <span>{meeting.duration}m</span>
                    </div>
                    <p className="text-[14px] font-medium text-foreground">
                      {meeting.title}
                    </p>
                    <p className="text-[12px] text-muted-foreground truncate">
                      {meeting.location}
                    </p>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline" className="text-[10px] bg-secondary text-muted-foreground border-border">
                        Summary
                      </Badge>
                      <Badge variant="outline" className="text-[10px] bg-secondary text-muted-foreground border-border">
                        Transcript
                      </Badge>
                      <Badge variant="outline" className="text-[10px] bg-secondary text-muted-foreground border-border">
                        Recording
                      </Badge>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex-1 space-y-4">
          <Card className="border-border/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                {selectedMeeting?.title ?? 'Meeting details'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4" />
                  <span>{selectedMeeting?.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ClockIcon className="w-4 h-4" />
                  <span>{selectedMeeting?.time} ({selectedMeeting?.duration}m)</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="bg-secondary">
              <TabsTrigger value="summary" className="text-[12px] px-4">Summary</TabsTrigger>
              <TabsTrigger value="transcript" className="text-[12px] px-4">Transcript</TabsTrigger>
              <TabsTrigger value="actions" className="text-[12px] px-4">Action items</TabsTrigger>
            </TabsList>

            <TabsContent value="summary" className="m-0">
              <Card className="border-border/60">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {selectedMeeting?.transcriptSummary}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="transcript" className="m-0">
              <Card className="border-border/60">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between gap-3">
                    <CardTitle className="text-base">Transcript</CardTitle>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline">
                        <PlayIcon className="w-4 h-4 mr-2" />
                        Play recording
                      </Button>
                      <Button size="sm" variant="outline">
                        <FileTextIcon className="w-4 h-4 mr-2" />
                        Download transcript
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    {selectedMeeting?.transcript?.map((line) => (
                      <div key={line.id} className="flex items-start gap-3">
                        <span className="text-[11px] text-muted-foreground w-12 flex-shrink-0">
                          {line.timestamp}
                        </span>
                        <div className="flex-1">
                          <p className="text-[12px] font-medium text-foreground">{line.speaker}</p>
                          <p className="text-[13px] text-muted-foreground">{line.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="actions" className="m-0">
              <Card className="border-border/60">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Action items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedMeeting?.actionItems?.map((item) => (
                      <div key={item.id} className="rounded-lg border border-border/70 px-3 py-2">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-[13px] text-foreground">{item.description}</p>
                          <Badge
                            variant="outline"
                            className={cn('text-[10px] uppercase tracking-wide', actionStatusStyles[item.status])}
                          >
                            {item.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-muted-foreground mt-2">
                          <span>Assignee: {formatAssignee(item.assigneeId)}</span>
                          <span>Due {new Date(item.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Card className="border-border/60">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Commitment tracker</CardTitle>
                <span className="text-[11px] text-muted-foreground">
                  {openCommitments.length} open
                </span>
              </div>
            </CardHeader>
            <CardContent>
              {openCommitments.length > 0 ? (
                <div className="space-y-3">
                  {openCommitments.map((item) => (
                    <div key={item.id} className="rounded-lg border border-border/70 px-3 py-2">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-[13px] text-foreground">{item.description}</p>
                          <p className="text-[11px] text-muted-foreground mt-1">
                            {item.meetingTitle} · {new Date(item.meetingDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className={cn('text-[10px] uppercase tracking-wide', actionStatusStyles[item.status])}
                        >
                          {item.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-muted-foreground mt-2">
                        <span>Assignee: {formatAssignee(item.assigneeId)}</span>
                        <span>Due {new Date(item.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No open commitments across meetings.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
