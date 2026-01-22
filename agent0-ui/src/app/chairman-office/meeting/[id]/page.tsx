'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { decisions, getMeetingById, getStakeholderById, stakeholders } from '@/lib/mock-data';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { 
  CalendarIcon,
  ClockIcon,
  DrawingPinIcon,
  VideoIcon,
  PersonIcon,
  ChatBubbleIcon,
  FileTextIcon,
  LightningBoltIcon,
  ArrowLeftIcon,
  PlayIcon,
  DownloadIcon
} from '@radix-ui/react-icons';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ChairmanMeetingBriefing({ params }: PageProps) {
  const router = useRouter();
  const { id } = use(params);
  const meeting = getMeetingById(id);

  if (!meeting) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-20 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-2">Meeting Not Found</h1>
        <p className="text-muted-foreground mb-6">The requested meeting could not be found.</p>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const discussionPoints = meeting.briefing
    ? [...meeting.briefing.talkingPoints, ...meeting.briefing.suggestedQuestions]
    : [];

  const transcriptSnippet = [
    `Chairman: We need clarity on ${meeting.title} timeline and dependencies.`,
    'ADDA: Phase 2 readiness is on track pending funding confirmation.',
    'Finance: Budget allocation is within the transformation envelope.',
  ].join('\n');

  const transcriptLines = [
    { time: '00:02', speaker: 'Chairman', text: 'Confirm TAMM 5.0 phase 2 readiness and key dependencies.' },
    { time: '03:18', speaker: 'Chief of Staff', text: 'Budget impact stays within the approved transformation envelope.' },
    { time: '07:42', speaker: 'Finance', text: 'We need the updated delivery timeline before Friday.' },
    { time: '11:05', speaker: 'ADDA', text: 'Data-sharing framework signatures are at 12 of 14.' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-6"
      >
        <Button 
          variant="ghost" 
          onClick={() => router.back()}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Back to Meetings
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        {/* Main Content */}
        <div className="space-y-6">
          {/* Header Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border-border/50">
              <CardContent className="p-6">
                <h1 className="text-2xl font-bold text-foreground mb-4">
                  {meeting.title}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4" />
                    <span>{formatDate(meeting.date)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ClockIcon className="w-4 h-4" />
                    <span>{formatTime(meeting.time)} ({meeting.duration} min)</span>
                  </div>
                  {meeting.location && (
                    <div className="flex items-center gap-2">
                      {meeting.location.includes('Virtual') ? (
                        <VideoIcon className="w-4 h-4" />
                      ) : (
                        <DrawingPinIcon className="w-4 h-4" />
                      )}
                      <span>{meeting.location}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Briefing Content */}
          {meeting.briefing && (
            <>
              {/* Talking Points & Questions */}
              {discussionPoints.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Card className="border-border/50 bg-card">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <ChatBubbleIcon className="w-5 h-5 text-foreground" />
                        Talking points & questions
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <ul className="space-y-3">
                        {discussionPoints.map((point, index) => (
                          <li key={index} className="flex items-start gap-3 p-3 rounded-lg bg-background/50">
                            <LightningBoltIcon className="w-4 h-4 text-foreground mt-0.5 flex-shrink-0" />
                            <span className="text-foreground text-sm">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Recent Interactions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="border-border/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <ClockIcon className="w-5 h-5 text-foreground" />
                      Recent Interactions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ul className="space-y-2">
                      {meeting.briefing.recentInteractions.map((interaction, index) => (
                        <li key={index} className="flex items-start gap-3 text-sm text-muted-foreground">
                          <span className="text-muted-foreground">•</span>
                          {interaction}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>


              {/* Transcript */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Card className="border-border/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <FileTextIcon className="w-5 h-5 text-foreground" />
                      Transcript
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-3">
                    <div className="rounded-lg border border-border bg-secondary/40 p-3 text-sm text-foreground whitespace-pre-wrap">
                      {transcriptSnippet}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>Last updated: 15 minutes ago</span>
                      <span>•</span>
                      <span>AI summarized</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <FileTextIcon className="w-4 h-4 mr-2" />
                        View full transcript
                      </Button>
                      <Button variant="outline" size="sm">
                        <DownloadIcon className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Recording */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65 }}
              >
                <Card className="border-border/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <PlayIcon className="w-5 h-5 text-foreground" />
                      Recording
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-3">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{meeting.duration} min recording</span>
                      <span>Available</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
                      <div className="h-full w-1/3 bg-primary rounded-full" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" className="bg-primary hover:bg-primary/90">
                        <PlayIcon className="w-4 h-4 mr-2" />
                        Play recording
                      </Button>
                      <Button variant="outline" size="sm">
                        <DownloadIcon className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Attendees */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <PersonIcon className="w-5 h-5 text-muted-foreground" />
                  Attendees ({meeting.attendees.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-1">
                {meeting.attendees.map((attendee) => {
                  const stakeholder = getStakeholderById(attendee.stakeholderId);
                  if (!stakeholder) return null;
                  return (
                    <div key={attendee.stakeholderId} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
                      <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-[13px] font-medium flex-shrink-0">
                        {stakeholder.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-medium text-foreground truncate">
                          {stakeholder.name}
                        </p>
                        <p className="text-[11px] text-muted-foreground truncate">
                          {stakeholder.title}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-[10px] bg-secondary text-foreground border-border flex-shrink-0">
                        {attendee.role}
                      </Badge>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </motion.div>

          {/* Related Decisions */}
          {meeting.briefing && meeting.briefing.relevantDecisions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <Card className="border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <FileTextIcon className="w-5 h-5 text-muted-foreground" />
                    Related Decisions
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="space-y-2">
                    {meeting.briefing.relevantDecisions.map((decisionTitle, index) => {
                      const match = decisions.find((decision) => !decision.isPrecedent && decision.title === decisionTitle);
                      return match ? (
                        <li key={index}>
                          <Link
                            href={`/chairman-office/decision/${match.id}`}
                            className="block text-sm text-foreground p-2 rounded-lg bg-secondary/30 hover:bg-secondary/60 transition-colors"
                          >
                            {decisionTitle}
                          </Link>
                        </li>
                      ) : (
                        <li key={index} className="text-sm text-foreground p-2 rounded-lg bg-secondary/30">
                          {decisionTitle}
                        </li>
                      );
                    })}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <Card className="border-border/50">
              <CardContent className="p-4 space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <FileTextIcon className="w-4 h-4 mr-2" />
                  Export Briefing
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
