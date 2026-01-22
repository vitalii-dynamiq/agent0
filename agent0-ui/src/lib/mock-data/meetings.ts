import { Meeting, BriefingCard } from '../types';

export const meetings: Meeting[] = [
  {
    id: 'meet-001',
    title: 'Weekly Leadership Majlis',
    date: '2026-01-19',
    time: '09:00',
    duration: 90,
    type: 'internal',
    location: 'Chairman\'s Office, Tower 1, Floor 15',
    attendees: [
      { stakeholderId: 'stake-1', role: 'host', confirmed: true },
      { stakeholderId: 'stake-2', role: 'required', confirmed: true },
      { stakeholderId: 'stake-3', role: 'required', confirmed: true },
      { stakeholderId: 'stake-4', role: 'required', confirmed: true },
      { stakeholderId: 'stake-5', role: 'required', confirmed: true },
      { stakeholderId: 'stake-10', role: 'required', confirmed: true },
    ],
    briefing: {
      objectives: [
        'Review TAMM 5.0 proposal ahead of Chairman decision',
        'Discuss Q1 budget execution progress',
        'Update on Emiratization targets',
      ],
      talkingPoints: [
        'TAMM 5.0 has strong endorsement from ADDA - recommend approval',
        'Budget execution at 23% of annual allocation - on track',
        'Graduate recruitment program received 340 applications - selection underway',
      ],
      openCommitments: [
        'Provide updated project timeline for Excellence Awards',
        'Circulate Responsible AI Framework draft to leadership',
      ],
      recentInteractions: [
        'Jan 14: Strategy alignment session with SPCO',
        'Jan 16: Budget review meeting with Finance',
      ],
      suggestedQuestions: [
        'What are the key dependencies for TAMM 5.0 Phase 1 completion?',
        'Are there any risks to the Q1 deliverables?',
      ],
      relevantDecisions: [
        'TAMM 5.0 Platform Development (pending Chairman)',
        'Responsible AI Governance Framework (pending review)',
      ],
    },
    recording: {
      status: 'available',
      duration: 78,
      provider: 'Teams',
      url: '#',
    },
    transcriptSummary: 'Discussion focused on TAMM 5.0 readiness, Q1 budget execution, and Emiratization targets. Action items assigned for timeline updates and policy drafts.',
    transcript: [
      { id: 't-1', speaker: 'Chairman', timestamp: '09:05', text: 'We need a clear path for TAMM 5.0 phase 2 and the risks to delivery.' },
      { id: 't-2', speaker: 'ADDA', timestamp: '09:12', text: 'Technical readiness is strong. We will deliver the updated timeline by Friday.' },
      { id: 't-3', speaker: 'Finance', timestamp: '09:20', text: 'Budget execution is on track. No funding gaps anticipated.' },
    ],
    actionItems: [
      {
        id: 'ai-101',
        description: 'Share updated TAMM 5.0 delivery timeline and risk mitigation plan.',
        assigneeId: 'stake-3',
        dueDate: '2026-01-23',
        status: 'in_progress',
      },
      {
        id: 'ai-102',
        description: 'Circulate data-sharing framework draft for final signatures.',
        assigneeId: 'stake-2',
        dueDate: '2026-01-24',
        status: 'pending',
      },
    ],
  },
  {
    id: 'meet-002',
    title: 'Department of Finance Coordination',
    date: '2026-01-19',
    time: '14:00',
    duration: 60,
    type: 'external',
    location: 'Department of Finance, Meeting Room 4A',
    attendees: [
      { stakeholderId: 'stake-6', role: 'host', confirmed: true },
      { stakeholderId: 'stake-5', role: 'required', confirmed: true },
    ],
    briefing: {
      objectives: [
        'Align on cross-government shared services cost model',
        'Discuss TAMM 5.0 funding allocation mechanism',
        'Review Q1 budget performance metrics',
      ],
      talkingPoints: [
        'DoF supportive of shared services initiative - confirms funding pathway',
        'TAMM funding can leverage existing digital transformation allocation',
        'Budget execution across government entities tracking positively',
      ],
      openCommitments: [
        'Share detailed cost-benefit analysis for shared HR services',
        'Provide TAMM 5.0 financial projections by entity',
      ],
      recentInteractions: [
        'Jan 15: Email exchange on budget coordination methodology',
        'Dec 2025: Quarterly fiscal review - positive engagement',
      ],
      suggestedQuestions: [
        'What is the timeline for shared services funding approval?',
        'Are there opportunities for additional efficiency initiatives this year?',
      ],
      relevantDecisions: [
        'Shared Services Center - HR Functions (pending review)',
        'Oracle Cloud Infrastructure Renewal (pending review)',
      ],
    },
    recording: {
      status: 'available',
      duration: 52,
      provider: 'Teams',
      url: '#',
    },
    transcriptSummary: 'Focused on shared services cost model, TAMM funding allocation, and Q1 performance metrics.',
    transcript: [
      { id: 't-1', speaker: 'DoF', timestamp: '14:05', text: 'We can align on the shared services model with minor adjustments.' },
      { id: 't-2', speaker: 'PMO', timestamp: '14:18', text: 'TAMM funding remains within the digital transformation allocation.' },
    ],
    actionItems: [
      {
        id: 'ai-201',
        description: 'Provide cost-benefit analysis for shared HR services.',
        assigneeId: 'stake-6',
        dueDate: '2026-01-26',
        status: 'pending',
      },
      {
        id: 'ai-202',
        description: 'Share TAMM funding allocation projections by entity.',
        assigneeId: 'stake-5',
        dueDate: '2026-01-27',
        status: 'pending',
      },
    ],
  },
  {
    id: 'meet-003',
    title: 'ADDA Digital Platform Alignment',
    date: '2026-01-20',
    time: '10:00',
    duration: 60,
    type: 'external',
    location: 'Virtual - Microsoft Teams',
    attendees: [
      { stakeholderId: 'stake-7', role: 'host', confirmed: true },
      { stakeholderId: 'stake-3', role: 'required', confirmed: true },
      { stakeholderId: 'stake-10', role: 'optional', confirmed: true },
    ],
    briefing: {
      objectives: [
        'Review TAMM platform integration requirements',
        'Discuss Cross-Entity Data Sharing Framework implementation',
        'Align on government cloud infrastructure roadmap',
      ],
      talkingPoints: [
        'ADDA fully supports TAMM 5.0 technical approach',
        'Data sharing framework addresses all ADDA security requirements',
        'Cloud infrastructure renewal timing aligns with ADDA procurement cycle',
      ],
      openCommitments: [
        'Provide technical architecture documentation',
        'Share data classification standards update',
      ],
      recentInteractions: [
        'Jan 16: Technical workshop on API standards',
        'Jan 17: Data governance alignment call',
      ],
      suggestedQuestions: [
        'What are ADDA\'s priorities for the unified government platform?',
        'How can we accelerate the data sharing implementation?',
      ],
      relevantDecisions: [
        'Cross-Entity Data Sharing Framework (pending Chairman)',
        'Government Contact Center AI Enhancement (in analysis)',
      ],
    },
    recording: {
      status: 'available',
      duration: 55,
      provider: 'Teams',
      url: '#',
    },
    transcriptSummary: 'Alignment focused on TAMM integration readiness, data sharing rollout sequencing, and cloud infrastructure dependencies.',
    transcript: [
      { id: 't-1', speaker: 'ADDA', timestamp: '10:04', text: 'Integration requirements are finalized and ready for the TAMM build sprint.' },
      { id: 't-2', speaker: 'DGE', timestamp: '10:19', text: 'We will sequence the data sharing rollout around the security milestones.' },
      { id: 't-3', speaker: 'ADDA', timestamp: '10:33', text: 'Cloud renewal timing aligns with the integration timeline.' },
    ],
    actionItems: [
      {
        id: 'ai-301',
        description: 'Provide updated TAMM integration checklist with security milestones.',
        assigneeId: 'stake-7',
        dueDate: '2026-01-22',
        status: 'in_progress',
      },
      {
        id: 'ai-302',
        description: 'Confirm data-sharing framework rollout sequence with ADDA.',
        assigneeId: 'stake-3',
        dueDate: '2026-01-23',
        status: 'pending',
      },
    ],
  },
  {
    id: 'meet-004',
    title: 'Morning Briefing',
    date: '2026-01-20',
    time: '08:30',
    duration: 30,
    type: 'one_on_one',
    location: 'Chairman\'s Office',
    attendees: [
      { stakeholderId: 'stake-1', role: 'required', confirmed: true },
    ],
    briefing: {
      objectives: [
        'Daily briefing and priority alignment',
        'Review decision queue status',
        'Prepare for ADDA meeting',
      ],
      talkingPoints: [
        '2 decisions in Chairman queue - both recommended for approval',
        'ADDA meeting preparation complete - briefing pack ready',
        'Executive Council quarterly report due next week',
      ],
      openCommitments: [],
      recentInteractions: [
        'Daily touchpoint - strong operational rhythm',
      ],
      suggestedQuestions: [],
      relevantDecisions: [
        'All pending decisions in Chairman queue',
      ],
    },
    recording: {
      status: 'available',
      duration: 28,
      provider: 'Teams',
      url: '#',
    },
    transcriptSummary: 'Quick alignment on decision queue, ADDA preparation, and executive priorities for the day.',
    transcript: [
      { id: 't-1', speaker: 'Chief of Staff', timestamp: '08:32', text: 'Two decisions remain in the approval queue, both recommended to proceed.' },
      { id: 't-2', speaker: 'Chairman', timestamp: '08:41', text: 'Ensure the ADDA briefing highlights the integration milestones.' },
    ],
    actionItems: [
      {
        id: 'ai-401',
        description: 'Finalize ADDA briefing pack and send to the Chairman.',
        assigneeId: 'stake-2',
        dueDate: '2026-01-20',
        status: 'in_progress',
      },
    ],
  },
  {
    id: 'meet-005',
    title: 'Executive Council Secretariat Alignment',
    date: '2026-01-21',
    time: '11:00',
    duration: 45,
    type: 'external',
    location: 'ECS Office, Capital Gate Tower',
    attendees: [
      { stakeholderId: 'stake-8', role: 'host', confirmed: true },
      { stakeholderId: 'stake-2', role: 'required', confirmed: true },
    ],
    briefing: {
      objectives: [
        'Prepare Q4 2025 performance report for Executive Council',
        'Align on 2026 strategic priorities presentation',
        'Discuss government coordination framework updates',
      ],
      talkingPoints: [
        'Q4 performance exceeded targets - 19% efficiency improvement documented',
        'TAMM 5.0 should be highlighted as flagship 2026 initiative',
        'Cross-entity coordination metrics showing positive trend',
      ],
      openCommitments: [
        'Finalize Executive Council presentation by Jan 25',
        'Prepare government efficiency case studies',
      ],
      recentInteractions: [
        'Jan 14: Initial presentation review',
        'Dec 2025: Quarterly coordination meeting - positive feedback',
      ],
      suggestedQuestions: [
        'What specific metrics does the Executive Council want to see?',
        'Are there any concerns about the 2026 strategic priorities?',
      ],
      relevantDecisions: [
        'Government Excellence Awards 2026 Budget (pending review)',
      ],
    },
    recording: {
      status: 'available',
      duration: 42,
      provider: 'Teams',
      url: '#',
    },
    transcriptSummary: 'Confirmed Q4 performance highlights, agreed on 2026 priority narrative, and aligned on coordination framework updates.',
    transcript: [
      { id: 't-1', speaker: 'ECS', timestamp: '11:06', text: 'We need the top-line performance narrative for the Council briefing.' },
      { id: 't-2', speaker: 'DGE', timestamp: '11:18', text: 'We will emphasize efficiency gains and TAMM 5.0 outcomes.' },
      { id: 't-3', speaker: 'ECS', timestamp: '11:29', text: 'Please include coordination metrics and case studies.' },
    ],
    actionItems: [
      {
        id: 'ai-501',
        description: 'Finalize Executive Council narrative summary with Q4 metrics.',
        assigneeId: 'stake-8',
        dueDate: '2026-01-24',
        status: 'pending',
      },
      {
        id: 'ai-502',
        description: 'Prepare coordination framework update slide for ECS review.',
        assigneeId: 'stake-2',
        dueDate: '2026-01-25',
        status: 'in_progress',
      },
    ],
  },
  {
    id: 'meet-006',
    title: 'Executive Council Quarterly Report',
    date: '2026-01-28',
    time: '10:00',
    duration: 120,
    type: 'board',
    location: 'Executive Council Chambers, Abu Dhabi',
    attendees: [
      { stakeholderId: 'stake-1', role: 'required', confirmed: true },
      { stakeholderId: 'stake-2', role: 'required', confirmed: true },
      { stakeholderId: 'stake-5', role: 'required', confirmed: true },
    ],
    briefing: {
      objectives: [
        'Present Q4 2025 performance report',
        'Outline 2026 strategic priorities',
        'Seek endorsement for TAMM 5.0 initiative',
      ],
      talkingPoints: [
        'Q4 performance exceeded all KPIs - 19% efficiency improvement',
        'TAMM Phase 1 achieved 94% citizen satisfaction',
        'Cross-entity coordination reduced service duplication by 28%',
      ],
      openCommitments: [
        'Finalize presentation materials by Jan 25',
        'Prepare financial projections for TAMM 5.0',
      ],
      recentInteractions: [
        'Oct 2025: Last quarterly report - received commendation',
      ],
      suggestedQuestions: [],
      relevantDecisions: [
        'TAMM 5.0 Platform Development (to be referenced)',
        'Responsible AI Governance Framework (to be referenced)',
      ],
    },
    recording: {
      status: 'available',
      duration: 110,
      provider: 'In-room',
      url: '#',
    },
    transcriptSummary: 'Quarterly report highlights, 2026 priorities, and TAMM 5.0 endorsement requirements were reviewed with the Council.',
    transcript: [
      { id: 't-1', speaker: 'Chairman', timestamp: '10:05', text: 'We are highlighting Q4 efficiency gains and citizen satisfaction.' },
      { id: 't-2', speaker: 'PMO', timestamp: '10:22', text: 'TAMM 5.0 endorsement requires clarity on funding phasing.' },
      { id: 't-3', speaker: 'Council', timestamp: '10:48', text: 'Provide the final delivery plan with risk mitigation.' },
    ],
    actionItems: [
      {
        id: 'ai-601',
        description: 'Deliver final TAMM 5.0 delivery plan with funding phasing.',
        assigneeId: 'stake-5',
        dueDate: '2026-01-27',
        status: 'pending',
      },
      {
        id: 'ai-602',
        description: 'Publish Q4 performance report pack for Council circulation.',
        assigneeId: 'stake-2',
        dueDate: '2026-01-28',
        status: 'in_progress',
      },
    ],
  },
];

export const todaysBriefingCards: BriefingCard[] = [
  {
    id: 'card-1',
    type: 'decisions',
    title: '2 Decisions Pending Approval',
    subtitle: 'TAMM 5.0 Platform & Data Sharing Framework',
    value: 'AED 42M',
    priority: 'high',
    action: 'Review',
    link: '/chairman/decisions',
  },
  {
    id: 'card-2',
    type: 'meeting',
    title: 'Weekly Leadership Majlis',
    subtitle: 'Today at 9:00 AM • 6 attendees',
    priority: 'high',
    action: 'View Brief',
    link: '/chairman/meeting/meet-001',
  },
  {
    id: 'card-3',
    type: 'meeting',
    title: 'Department of Finance',
    subtitle: 'Today at 2:00 PM • Budget Coordination',
    priority: 'medium',
    action: 'Prepare',
    link: '/chairman/meeting/meet-002',
  },
  {
    id: 'card-4',
    type: 'initiative',
    title: 'Excellence Awards Planning',
    subtitle: 'Budget approval in review queue',
    value: 'On Track',
    priority: 'low',
    action: 'Details',
  },
  {
    id: 'card-5',
    type: 'insight',
    title: 'Decision Throughput +23%',
    subtitle: 'This week vs. previous week average',
    priority: 'low',
  },
];

export const getMeetingById = (id: string): Meeting | undefined => {
  return meetings.find(m => m.id === id);
};

export const getTodaysMeetings = (): Meeting[] => {
  const today = '2026-01-19'; // Mock today's date
  return meetings.filter(m => m.date === today);
};

export const getUpcomingMeetings = (days: number = 7): Meeting[] => {
  return meetings;
};
