'use client';

import Link from 'next/link';
import { meetings, stakeholders } from '@/lib/mock-data';
import { Badge } from '@/components/ui/badge';
import { StakeholderAvatarGroup } from '@/components/shared/stakeholder-badge';
import { cn } from '@/lib/utils';
import { 
  CalendarIcon, 
  ClockIcon, 
  DrawingPinIcon, 
  PersonIcon, 
  VideoIcon,
  HomeIcon,
  ChevronRightIcon,
  FileTextIcon,
  PlayIcon
} from '@radix-ui/react-icons';

const meetingTypeConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  internal: { label: 'Internal', color: 'bg-secondary text-foreground border-border', icon: HomeIcon },
  external: { label: 'External', color: 'bg-secondary text-foreground border-border', icon: PersonIcon },
  board: { label: 'Board', color: 'bg-secondary text-foreground border-border', icon: PersonIcon },
  one_on_one: { label: '1:1', color: 'bg-secondary text-foreground border-border', icon: PersonIcon },
};

export default function ChairmanMeetings() {
  const today = '2026-01-19';
  const todayMeetings = meetings.filter(m => m.date === today);
  const upcomingMeetings = meetings.filter(m => m.date > today);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Meetings</h1>
        <p className="text-muted-foreground">
          Meeting intelligence with transcripts, recordings, and AI briefs
        </p>
      </div>

      {/* Today's Meetings */}
      <section className="mb-8 sm:mb-10">
        <div className="flex items-center gap-2 mb-4">
          <CalendarIcon className="w-5 h-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold text-foreground">Today</h2>
          <Badge variant="outline" className="bg-secondary text-foreground border-border">
            {todayMeetings.length} meetings
          </Badge>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {todayMeetings.map((meeting) => (
            <MeetingCard key={meeting.id} meeting={meeting} />
          ))}
          {todayMeetings.length === 0 && (
            <div className="p-6 border border-border rounded-xl bg-card text-center">
              <CalendarIcon className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No meetings scheduled for today</p>
            </div>
          )}
        </div>
      </section>

      {/* Upcoming Meetings */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <ClockIcon className="w-5 h-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold text-foreground">Upcoming</h2>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {upcomingMeetings.map((meeting) => (
            <MeetingCard key={meeting.id} meeting={meeting} showDate />
          ))}
          {upcomingMeetings.length === 0 && (
            <div className="p-6 border border-border rounded-xl bg-card text-center">
              <ClockIcon className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No upcoming meetings</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

interface MeetingCardProps {
  meeting: typeof meetings[0];
  showDate?: boolean;
}

function MeetingCard({ meeting, showDate }: MeetingCardProps) {
  const typeConfig = meetingTypeConfig[meeting.type];
  const TypeIcon = typeConfig.icon;
  const attendeeIds = meeting.attendees.map(a => a.stakeholderId);

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-AE', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Link href={`/chairman-office/meeting/${meeting.id}`}>
      <div className="p-4 sm:p-5 border border-border rounded-xl transition-all duration-200 card-glow bg-card">
          <div className="flex flex-col sm:flex-row sm:items-start gap-4">
            {/* Time Column */}
            <div className="flex sm:flex-col items-center sm:items-start gap-2 sm:gap-0 sm:w-20 flex-shrink-0 sm:text-center">
              <p className="text-xl sm:text-2xl font-bold text-foreground tabular-nums">{formatTime(meeting.time).split(' ')[0]}</p>
              <p className="text-xs text-muted-foreground">{formatTime(meeting.time).split(' ')[1]}</p>
              <p className="text-xs text-muted-foreground sm:mt-1">{meeting.duration} min</p>
              {showDate && (
                <p className="text-xs text-muted-foreground sm:mt-1 bg-muted px-2 py-0.5 rounded">
                  {formatDate(meeting.date)}
                </p>
              )}
            </div>

            {/* Divider - Desktop only */}
            <div className="hidden sm:block w-px h-20 bg-border" />

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <Badge variant="outline" className={cn("text-xs", typeConfig.color)}>
                  <TypeIcon className="w-3 h-3 mr-1" />
                  {typeConfig.label}
                </Badge>
                <Badge variant="outline" className="text-xs bg-secondary text-foreground border-border">
                  <FileTextIcon className="w-3 h-3 mr-1" />
                  Transcript
                </Badge>
                <Badge variant="outline" className="text-xs bg-secondary text-foreground border-border">
                  <PlayIcon className="w-3 h-3 mr-1" />
                  Recording
                </Badge>
              </div>

              <h3 className="font-semibold text-foreground mb-1 group-hover:text-navy transition-colors">
                {meeting.title}
              </h3>

                <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm text-muted-foreground">
                {meeting.location && (
                  <div className="flex items-center gap-1">
                    {meeting.location.includes('Virtual') ? (
                      <VideoIcon className="w-4 h-4" />
                    ) : (
                      <DrawingPinIcon className="w-4 h-4" />
                    )}
                    <span className="truncate max-w-[180px] sm:max-w-[200px]">{meeting.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <PersonIcon className="w-4 h-4" />
                  <span>{meeting.attendees.length} attendees</span>
                </div>
              </div>
            </div>

            {/* Attendees & Action - Desktop */}
            <div className="hidden sm:flex items-center gap-4">
              <StakeholderAvatarGroup 
                stakeholderIds={attendeeIds} 
                stakeholders={stakeholders}
                max={3}
                size="sm"
              />
              <ChevronRightIcon className="w-5 h-5 text-muted-foreground transition-colors" />
            </div>
          </div>
        </div>
    </Link>
  );
}
