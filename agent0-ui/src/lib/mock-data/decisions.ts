import {
  AdeoFlowStep,
  AuthorityBarometerOutput,
  Decision,
  DecisionExecution,
  DecisionLevel,
  DecisionOutcome,
  DecisionRouteStep,
  DecisionStatus,
  DecisionTriage,
  WorkflowStep,
} from '../types';

const buildAdeoFlow = (activeIndex: number, notes?: Record<number, string>): AdeoFlowStep[] => {
  const steps = [
    'Upload to ECAS',
    'Archetype assignment',
    'Completeness check',
    'Framework evaluation',
    'Scoring & prioritization',
    'Committee decision',
  ];

  return steps.map((label, index) => ({
    id: `adeo-${index + 1}`,
    label,
    status: index < activeIndex ? 'completed' : index === activeIndex ? 'in_progress' : 'pending',
    notes: notes?.[index],
  }));
};

const buildAuthority = (
  tier: DecisionLevel,
  status: AuthorityBarometerOutput['status'],
  confidence: number,
  drivers: string[],
  lastUpdated: string
): AuthorityBarometerOutput => ({
  tier,
  status,
  confidence,
  drivers,
  lastUpdated,
});

const ROUTE_STEPS = ['Intake', 'Triage', 'Context', 'Analysis', 'Review', 'Decision', 'Execution', 'Outcome'];

const ACTIVE_INDEX_BY_STATUS: Record<DecisionStatus, number> = {
  incoming: 0,
  classifying: 1,
  in_analysis: 3,
  awaiting_review: 4,
  with_chairman: 5,
  in_execution: 6,
  completed: 7,
  rejected: 7,
};

const buildRoute = (status: DecisionStatus, updatedAt: string): DecisionRouteStep[] => {
  if (status === 'completed' || status === 'rejected') {
    return ROUTE_STEPS.map((label, index) => ({
      id: `route-${index + 1}`,
      label,
      status: 'completed',
      timestamp: index === ROUTE_STEPS.length - 1 ? updatedAt : undefined,
    }));
  }

  const activeIndex = ACTIVE_INDEX_BY_STATUS[status] ?? 0;
  return ROUTE_STEPS.map((label, index) => ({
    id: `route-${index + 1}`,
    label,
    status: index < activeIndex ? 'completed' : index === activeIndex ? 'active' : 'pending',
  }));
};

const buildTriage = (
  level: DecisionLevel,
  queuePosition: number,
  status: DecisionStatus,
  override?: Partial<DecisionTriage>
): DecisionTriage => {
  const priority = level === 3 ? 'high' : level === 2 ? 'medium' : 'low';
  const slaTargetHours = level === 3 ? 6 : level === 2 ? 12 : 24;
  const slaStatus =
    status === 'incoming' || status === 'classifying'
      ? 'on_track'
      : status === 'in_analysis' || status === 'awaiting_review'
        ? 'at_risk'
        : 'on_track';

  return {
    priority,
    queuePosition,
    slaTargetHours,
    slaStatus,
    ...override,
  };
};

const buildExecution = (status: DecisionStatus, owner: string, override?: Partial<DecisionExecution>): DecisionExecution => {
  const baseMilestones = [
    { id: 'ms-1', title: 'Execution kickoff', status: 'completed' as const, eta: 'Jan 22' },
    { id: 'ms-2', title: 'Delivery phase', status: 'active' as const, eta: 'Feb 05' },
    { id: 'ms-3', title: 'Outcome validation', status: 'pending' as const, eta: 'Feb 18' },
  ];

  let progress = 20;
  let milestones = baseMilestones;

  if (status === 'in_execution') {
    progress = 58;
  } else if (status === 'completed') {
    progress = 100;
    milestones = baseMilestones.map((item) => ({ ...item, status: 'completed' as const }));
  } else if (status === 'rejected') {
    progress = 0;
    milestones = baseMilestones.map((item, index) => ({
      ...item,
      status: index === 0 ? 'completed' : 'pending',
    }));
  }

  return {
    progress,
    owner,
    milestones,
    ...override,
  };
};

const buildOutcome = (
  status: DecisionStatus,
  override?: Partial<DecisionOutcome>
): DecisionOutcome => {
  const statusMap: Record<DecisionStatus, DecisionOutcome['status']> = {
    incoming: 'on_track',
    classifying: 'on_track',
    in_analysis: 'at_risk',
    awaiting_review: 'at_risk',
    with_chairman: 'on_track',
    in_execution: 'on_track',
    completed: 'achieved',
    rejected: 'missed',
  };

  const impactSummary =
    status === 'completed'
      ? 'Execution delivered within scope; early benefits tracking as expected.'
      : status === 'in_execution'
        ? 'Execution underway with baseline KPIs tracking to plan.'
        : status === 'rejected'
          ? 'Decision closed; resources reallocated to higher‑priority initiatives.'
          : 'Awaiting approval; execution plan ready for activation.';

  const learningSignal =
    status === 'completed'
      ? 'Confirm success drivers and feed into authority thresholds.'
      : status === 'rejected'
        ? 'Capture rejection rationale to refine intake triage.'
        : 'Log reviewer feedback to improve routing confidence.';

  return {
    status: statusMap[status],
    impactSummary,
    learningSignal,
    ...override,
  };
};

const buildWorkflowSteps = (status: DecisionStatus): WorkflowStep[] => {
  const steps = ['Intake', 'Context', 'Analysis', 'Review', 'Decision', 'Execution'];
  const activeIndex = status === 'incoming' ? 0
    : status === 'in_analysis' ? 2
    : status === 'awaiting_review' ? 3
    : status === 'with_chairman' ? 4
    : status === 'in_execution' ? 5
    : status === 'completed' || status === 'rejected' ? 5
    : 1;

  return steps.map((name, index) => ({
    id: `wf-${index + 1}`,
    name,
    status: index < activeIndex ? 'completed' : index === activeIndex ? 'active' : 'pending',
  }));
};

const getDefaultRecommendation = (decision: Decision): Decision['aiRecommendation'] => {
  if (decision.status === 'rejected') return 'reject';
  if (decision.status === 'with_chairman' || decision.status === 'in_execution' || decision.status === 'completed') {
    return 'approve';
  }
  if (decision.level === 3) return 'approve';
  if (decision.level === 2) return 'defer';
  return 'approve';
};

const getDefaultConfidence = (index: number) => 72 + ((index * 7) % 22);

const buildDefaultReasoning = (decision: Decision) => {
  const valueLine = decision.value
    ? `Value at AED ${(decision.value / 1000000).toFixed(1)}M with ${decision.category} alignment.`
    : `${decision.category} decision aligned with current portfolio priorities.`;
  return [
    valueLine,
    'Recommendation based on precedent alignment, stakeholder impact, and policy compliance.',
    'Execution readiness and cross-entity dependencies were considered in the routing.',
  ].join(' ');
};

const buildDefaultRiskAssessment = (decision: Decision) => {
  const overall = decision.level === 3 ? 'high' : decision.level === 2 ? 'medium' : 'low';
  const financial = decision.value && decision.value > 15000000 ? 'high' : decision.value ? 'medium' : 'low';
  const operational = decision.category === 'infrastructure' ? 'high' : 'medium';
  const reputational = decision.category === 'policy' || decision.level === 3 ? 'high' : 'medium';
  return {
    overall,
    financial,
    operational,
    reputational,
    factors: [
      'Cross-entity dependencies require alignment',
      'Funding readiness and timeline sensitivity reviewed',
      'Policy compliance checks passed',
    ],
  };
};

const buildDefaultAuthority = (decision: Decision) => {
  const status = decision.level === 3 ? 'chairman' : decision.level === 2 ? 'review' : 'auto';
  const drivers = [
    `Decision level L${decision.level}`,
    `${decision.category} classification`,
    decision.value ? `Value AED ${(decision.value / 1000000).toFixed(1)}M` : 'Non-financial decision',
  ];
  return buildAuthority(decision.level, status, decision.aiConfidence ?? 82, drivers, decision.updatedAt);
};

const buildDefaultAdeoFlow = (decision: Decision) => {
  const activeIndex = decision.level === 3 ? 4 : decision.level === 2 ? 2 : 1;
  return buildAdeoFlow(activeIndex);
};

const baseDecisions: Decision[] = [
  // Level 3 - High Stakes (With Chairman)
  {
    id: 'dec-001',
    title: 'TAMM 5.0 Platform Development',
    description: 'Approval for Phase 2 development of the unified government services platform (TAMM), including AI-powered service recommendations, predictive citizen needs, and cross-entity data integration. Aligns with Abu Dhabi Government Digital Strategy 2025-2030.',
    category: 'strategic',
    level: 3,
    status: 'with_chairman',
    ceoPillar: 'priority_setting',
    requesterId: 'stake-3',
    departmentId: 'dept-3',
    value: 42000000,
    dueDate: '2026-01-25',
    createdAt: '2026-01-08T08:00:00Z',
    updatedAt: '2026-01-19T06:00:00Z',
    authorityBarometer: buildAuthority(
      3,
      'chairman',
      88,
      ['Value exceeds AED 25M threshold', 'Cross-entity impact', 'Public visibility and precedent'],
      '2026-01-19T06:00:00Z'
    ),
    adeoFlow: buildAdeoFlow(5, {
      5: 'Queued for committee decision window',
    }),
    aiRecommendation: 'approve',
    aiConfidence: 89,
    aiReasoning: 'Strong alignment with Abu Dhabi Digital Strategy. Phase 1 achieved 94% citizen satisfaction. ADDA endorsement received. Budget within allocated transformation fund.',
    riskAssessment: {
      overall: 'medium',
      financial: 'medium',
      operational: 'low',
      reputational: 'low',
      factors: [
        'Multi-year commitment requires sustained funding',
        'Technical complexity manageable with existing team',
        'Strong vendor ecosystem in place',
      ],
    },
    precedents: [
      {
        id: 'prec-1',
        title: 'TAMM Platform Launch 2019',
        outcome: 'approved',
        date: '2019-04-15',
        similarity: 92,
        precedentDecisionId: 'prec-1',
      },
      {
        id: 'prec-2',
        title: 'Government Services Integration 2022',
        outcome: 'approved',
        date: '2022-09-20',
        similarity: 78,
        precedentDecisionId: 'prec-2',
      },
    ],
    stakeholderImpact: [
      { stakeholderId: 'stake-7', impact: 'positive', notes: 'ADDA strongly supports unified platform' },
      { stakeholderId: 'stake-5', impact: 'neutral', notes: 'Budget impact within planned allocations' },
      { stakeholderId: 'stake-8', impact: 'positive', notes: 'ECS anticipates improved coordination' },
    ],
    workflowSteps: [
      { id: 'ws-1', name: 'Intake', status: 'completed', completedAt: '2026-01-08T08:15:00Z' },
      { id: 'ws-2', name: 'Classification', status: 'completed', completedAt: '2026-01-08T08:20:00Z', notes: 'Auto-classified as Level 3 - Strategic value above AED 25M threshold' },
      { id: 'ws-3', name: 'Context Assembly', status: 'completed', completedAt: '2026-01-10T10:00:00Z' },
      { id: 'ws-4', name: 'Analysis', status: 'completed', completedAt: '2026-01-15T14:00:00Z' },
      { id: 'ws-5', name: 'Undersecretary Review', status: 'completed', completedAt: '2026-01-18T16:00:00Z', actor: 'H.E. Sultan bin Ahmed Al Jaber' },
      { id: 'ws-6', name: 'Chairman Decision', status: 'active' },
      { id: 'ws-7', name: 'Execution', status: 'pending' },
    ],
  },
  {
    id: 'dec-002',
    title: 'Cross-Entity Data Sharing Framework',
    description: 'Establish formal data sharing agreements between DGE, ADDA, DoF, and 12 other government entities. Enables unified citizen profiles and reduces duplicate data collection by estimated 40%.',
    category: 'policy',
    level: 3,
    status: 'with_chairman',
    ceoPillar: 'operational_alignment',
    requesterId: 'stake-10',
    departmentId: 'dept-3',
    value: 0,
    dueDate: '2026-01-22',
    createdAt: '2026-01-05T09:00:00Z',
    updatedAt: '2026-01-18T15:00:00Z',
    authorityBarometer: buildAuthority(
      3,
      'chairman',
      81,
      ['High reputational exposure', 'Regulatory sensitivity', 'Multi-entity data governance'],
      '2026-01-18T15:00:00Z'
    ),
    adeoFlow: buildAdeoFlow(4, {
      4: 'Scoring underway with governance committee',
    }),
    aiRecommendation: 'approve',
    aiConfidence: 82,
    aiReasoning: 'Critical enabler for government efficiency targets. Privacy impact assessment completed. All entities have signed preliminary MOUs. Recommend approval with quarterly compliance reviews.',
    escalatedFrom: 2,
    escalationReason: 'Data privacy considerations require Chairman-level oversight. Framework establishes precedent for future cross-entity data initiatives.',
    riskAssessment: {
      overall: 'medium',
      financial: 'low',
      operational: 'medium',
      reputational: 'high',
      factors: [
        'Data privacy requires careful implementation',
        'Strong legal framework in place',
        'Clear governance structure defined',
      ],
    },
    precedents: [
      {
        id: 'prec-3',
        title: 'Healthcare Data Integration 2024',
        outcome: 'approved',
        date: '2024-03-10',
        similarity: 68,
        precedentDecisionId: 'prec-3',
      },
    ],
    stakeholderImpact: [
      { stakeholderId: 'stake-7', impact: 'positive', notes: 'ADDA will manage technical implementation' },
      { stakeholderId: 'stake-6', impact: 'positive', notes: 'DoF sees cost reduction opportunity' },
    ],
    workflowSteps: [
      { id: 'ws-1', name: 'Intake', status: 'completed', completedAt: '2026-01-05T09:10:00Z' },
      { id: 'ws-2', name: 'Classification', status: 'completed', completedAt: '2026-01-05T09:15:00Z', notes: 'Initially classified as Level 2, escalated due to data governance implications' },
      { id: 'ws-3', name: 'Context Assembly', status: 'completed', completedAt: '2026-01-08T11:00:00Z' },
      { id: 'ws-4', name: 'Analysis', status: 'completed', completedAt: '2026-01-14T09:00:00Z', notes: 'Privacy impact assessment completed' },
      { id: 'ws-5', name: 'Escalation', status: 'completed', completedAt: '2026-01-14T09:30:00Z', notes: 'Escalated to Level 3' },
      { id: 'ws-6', name: 'Chairman Decision', status: 'active' },
      { id: 'ws-7', name: 'Execution', status: 'pending' },
    ],
  },

  // Level 2 - Collaborative (Awaiting Review)
  {
    id: 'dec-003',
    title: 'Government Excellence Awards 2026 Budget',
    description: 'Annual budget allocation for the Abu Dhabi Government Excellence Awards program, including ceremonies, assessments, and recognition initiatives across 45 government entities.',
    category: 'budget',
    level: 2,
    status: 'awaiting_review',
    ceoPillar: 'operational_alignment',
    requesterId: 'stake-2',
    departmentId: 'dept-2',
    value: 3200000,
    dueDate: '2026-01-23',
    createdAt: '2026-01-15T10:00:00Z',
    updatedAt: '2026-01-19T08:00:00Z',
    authorityBarometer: buildAuthority(
      2,
      'review',
      86,
      ['Recurring program with precedent', 'Budget within annual plan', 'Low reputational exposure'],
      '2026-01-19T08:00:00Z'
    ),
    adeoFlow: buildAdeoFlow(3, {
      3: 'Framework evaluation in progress',
    }),
    aiRecommendation: 'approve',
    aiConfidence: 94,
    aiReasoning: 'Annual recurring program with established ROI. Budget in line with previous years. All logistics partners confirmed. Strong leadership support.',
    riskAssessment: {
      overall: 'low',
      financial: 'low',
      operational: 'low',
      reputational: 'low',
      factors: [
        'Established annual program',
        'Budget within historical norms',
        'Vendor contracts in place',
      ],
    },
    precedents: [
      {
        id: 'prec-4',
        title: 'Excellence Awards 2025',
        outcome: 'approved',
        date: '2025-01-18',
        similarity: 98,
        precedentDecisionId: 'prec-4',
      },
      {
        id: 'prec-5',
        title: 'Excellence Awards 2024',
        outcome: 'approved',
        date: '2024-01-15',
        similarity: 96,
        precedentDecisionId: 'prec-5',
      },
    ],
    stakeholderImpact: [
      { stakeholderId: 'stake-5', impact: 'neutral', notes: 'Budget pre-allocated in annual plan' },
      { stakeholderId: 'stake-8', impact: 'positive', notes: 'ECS co-sponsors program' },
    ],
    workflowSteps: [
      { id: 'ws-1', name: 'Intake', status: 'completed', completedAt: '2026-01-15T10:05:00Z' },
      { id: 'ws-2', name: 'Classification', status: 'completed', completedAt: '2026-01-15T10:08:00Z' },
      { id: 'ws-3', name: 'Context Assembly', status: 'completed', completedAt: '2026-01-16T14:00:00Z' },
      { id: 'ws-4', name: 'Analysis', status: 'completed', completedAt: '2026-01-18T11:00:00Z' },
      { id: 'ws-5', name: 'Undersecretary Review', status: 'active' },
      { id: 'ws-6', name: 'Execution', status: 'pending' },
    ],
  },
  {
    id: 'dec-004',
    title: 'Shared Services Center - HR Functions',
    description: 'Centralize HR administrative functions (payroll processing, leave management, recruitment support) for 8 small-to-medium government entities. Projected savings of AED 4.2M annually.',
    category: 'partnership',
    level: 2,
    status: 'awaiting_review',
    ceoPillar: 'team_talent',
    requesterId: 'stake-4',
    departmentId: 'dept-4',
    value: 8500000,
    dueDate: '2026-01-28',
    createdAt: '2026-01-12T11:00:00Z',
    updatedAt: '2026-01-19T07:00:00Z',
    authorityBarometer: buildAuthority(
      2,
      'review',
      79,
      ['Cross-entity workforce impact', 'Operational efficiency upside', 'Change management risk'],
      '2026-01-19T07:00:00Z'
    ),
    adeoFlow: buildAdeoFlow(2, {
      2: 'Completeness review underway',
    }),
    aiRecommendation: 'approve',
    aiConfidence: 86,
    aiReasoning: 'Aligns with government efficiency mandate. Similar models successful in Dubai. All participating entities have signed letters of intent. Implementation plan reviewed by ADDA.',
    riskAssessment: {
      overall: 'low',
      financial: 'medium',
      operational: 'low',
      reputational: 'low',
      factors: [
        'Initial investment recoverable within 2 years',
        'Change management requires attention',
        'Strong precedent from other emirates',
      ],
    },
    stakeholderImpact: [
      { stakeholderId: 'stake-6', impact: 'positive', notes: 'DoF endorses efficiency initiative' },
      { stakeholderId: 'stake-4', impact: 'positive', notes: 'Corporate Services will lead implementation' },
    ],
  },
  {
    id: 'dec-005',
    title: 'Emiratization Acceleration Program',
    description: 'Expand graduate recruitment and training program to onboard 45 Emirati nationals across DGE departments in 2026, including specialized AI and data analytics tracks.',
    category: 'policy',
    level: 2,
    status: 'in_analysis',
    ceoPillar: 'team_talent',
    requesterId: 'stake-4',
    departmentId: 'dept-4',
    dueDate: '2026-01-30',
    createdAt: '2026-01-14T09:00:00Z',
    updatedAt: '2026-01-19T05:00:00Z',
    authorityBarometer: buildAuthority(
      2,
      'review',
      71,
      ['Workforce impact', 'Policy alignment required', 'Capacity confirmation pending'],
      '2026-01-19T05:00:00Z'
    ),
    adeoFlow: buildAdeoFlow(1, {
      1: 'Awaiting archetype assignment',
    }),
    aiConfidence: 72,
    aiReasoning: 'Analysis in progress. Gathering capacity assessment data and university partnership confirmations.',
    workflowSteps: [
      { id: 'ws-1', name: 'Intake', status: 'completed', completedAt: '2026-01-14T09:10:00Z' },
      { id: 'ws-2', name: 'Classification', status: 'completed', completedAt: '2026-01-14T09:12:00Z' },
      { id: 'ws-3', name: 'Context Assembly', status: 'completed', completedAt: '2026-01-17T16:00:00Z' },
      { id: 'ws-4', name: 'Analysis', status: 'active', notes: 'Awaiting university partnership confirmations' },
    ],
  },
  {
    id: 'dec-006',
    title: 'Oracle Cloud Infrastructure Renewal',
    description: 'Three-year renewal of Oracle Cloud Infrastructure agreement for government workloads. Includes migration support for legacy applications and enhanced security features.',
    category: 'procurement',
    level: 2,
    status: 'awaiting_review',
    ceoPillar: 'operational_alignment',
    requesterId: 'stake-5',
    departmentId: 'dept-5',
    value: 15000000,
    dueDate: '2026-01-26',
    createdAt: '2026-01-11T14:00:00Z',
    updatedAt: '2026-01-18T17:00:00Z',
    authorityBarometer: buildAuthority(
      2,
      'review',
      84,
      ['Infrastructure dependency', 'Vendor concentration risk', 'Budget within procurement limits'],
      '2026-01-18T17:00:00Z'
    ),
    adeoFlow: buildAdeoFlow(3, {
      3: 'Framework evaluation in progress',
    }),
    aiRecommendation: 'approve',
    aiConfidence: 91,
    aiReasoning: 'Critical infrastructure contract. 8% cost reduction negotiated from current rates. Aligned with ADDA cloud-first strategy. No viable migration alternative in current timeline.',
    riskAssessment: {
      overall: 'low',
      financial: 'low',
      operational: 'low',
      reputational: 'low',
      factors: [
        'Existing infrastructure - minimal implementation risk',
        'Negotiated rate below market benchmark',
        'Strong vendor relationship and SLA track record',
      ],
    },
    stakeholderImpact: [
      { stakeholderId: 'stake-7', impact: 'positive', notes: 'ADDA approved technical specifications' },
      { stakeholderId: 'stake-9', impact: 'positive', notes: 'Dynamiq confirms compatibility for Agent-0' },
    ],
  },

  // Level 1 - Autonomous (In Execution or Completed)
  {
    id: 'dec-007',
    title: 'Q1 Office Supplies Procurement',
    description: 'Standard quarterly procurement of office supplies across DGE headquarters and satellite offices.',
    category: 'procurement',
    level: 1,
    status: 'completed',
    ceoPillar: 'operational_alignment',
    requesterId: 'stake-4',
    departmentId: 'dept-4',
    value: 48000,
    dueDate: '2026-01-15',
    createdAt: '2026-01-08T08:00:00Z',
    updatedAt: '2026-01-15T09:00:00Z',
    authorityBarometer: buildAuthority(
      1,
      'auto',
      96,
      ['Low value threshold', 'Policy compliant procurement', 'Routine renewal'],
      '2026-01-15T09:00:00Z'
    ),
    adeoFlow: buildAdeoFlow(6, {
      5: 'Approved under delegated authority',
    }),
    aiRecommendation: 'approve',
    aiConfidence: 99,
    aiReasoning: 'Routine procurement within budget. Approved vendor from government supplier list.',
  },
  {
    id: 'dec-008',
    title: 'Meeting Room AV System Upgrade',
    description: 'Upgrade video conferencing equipment in 6 meeting rooms to support hybrid meeting requirements.',
    category: 'procurement',
    level: 1,
    status: 'in_execution',
    ceoPillar: 'operational_alignment',
    requesterId: 'stake-3',
    departmentId: 'dept-3',
    value: 85000,
    dueDate: '2026-01-20',
    createdAt: '2026-01-13T11:00:00Z',
    updatedAt: '2026-01-17T14:00:00Z',
    authorityBarometer: buildAuthority(
      1,
      'auto',
      93,
      ['Pre-qualified vendor', 'Operational continuity', 'Low reputational risk'],
      '2026-01-17T14:00:00Z'
    ),
    adeoFlow: buildAdeoFlow(5, {
      5: 'Execution in progress',
    }),
    aiRecommendation: 'approve',
    aiConfidence: 97,
    aiReasoning: 'Standard IT maintenance within approved budget. Equipment from pre-qualified vendor list.',
  },
  {
    id: 'dec-009',
    title: 'Leadership Development Workshop Series',
    description: 'Enrollment of 25 senior staff in executive leadership program delivered by INSEAD.',
    category: 'hr',
    level: 1,
    status: 'completed',
    ceoPillar: 'team_talent',
    requesterId: 'stake-4',
    departmentId: 'dept-4',
    value: 187500,
    dueDate: '2026-01-12',
    createdAt: '2026-01-05T10:00:00Z',
    updatedAt: '2026-01-12T16:00:00Z',
    authorityBarometer: buildAuthority(
      1,
      'auto',
      95,
      ['Within training budget', 'Pre-approved provider', 'Low operational risk'],
      '2026-01-12T16:00:00Z'
    ),
    adeoFlow: buildAdeoFlow(6, {
      5: 'Approved under delegated authority',
    }),
    aiRecommendation: 'approve',
    aiConfidence: 98,
    aiReasoning: 'Within approved training budget. Pre-approved training provider. Supports leadership pipeline initiative.',
  },

  // More decisions in pipeline
  {
    id: 'dec-010',
    title: 'Annual Cybersecurity Assessment',
    description: 'Engage certified external vendor for comprehensive security assessment including penetration testing and vulnerability scanning.',
    category: 'procurement',
    level: 2,
    status: 'in_analysis',
    ceoPillar: 'operational_alignment',
    requesterId: 'stake-3',
    departmentId: 'dept-3',
    value: 450000,
    dueDate: '2026-02-01',
    createdAt: '2026-01-16T09:00:00Z',
    updatedAt: '2026-01-19T04:00:00Z',
    authorityBarometer: buildAuthority(
      2,
      'review',
      58,
      ['Security sensitivity', 'Vendor selection pending', 'Operational risk mitigation'],
      '2026-01-19T04:00:00Z'
    ),
    adeoFlow: buildAdeoFlow(2, {
      2: 'Completeness review underway',
    }),
    aiConfidence: 55,
    aiReasoning: 'Gathering vendor proposals from ADDA-approved security firms.',
  },
  {
    id: 'dec-011',
    title: 'Government Contact Center AI Enhancement',
    description: 'Deploy AI-powered contact center solution to handle routine citizen inquiries, integrated with TAMM platform. Expected to reduce call handling time by 35%.',
    category: 'strategic',
    level: 3,
    status: 'in_analysis',
    ceoPillar: 'priority_setting',
    requesterId: 'stake-10',
    departmentId: 'dept-3',
    value: 12000000,
    dueDate: '2026-02-15',
    createdAt: '2026-01-05T08:00:00Z',
    updatedAt: '2026-01-19T06:30:00Z',
    authorityBarometer: buildAuthority(
      3,
      'chairman',
      67,
      ['Strategic platform investment', 'Citizen experience impact', 'AI risk considerations'],
      '2026-01-19T06:30:00Z'
    ),
    adeoFlow: buildAdeoFlow(3, {
      3: 'Framework evaluation in progress',
    }),
    aiConfidence: 62,
    aiReasoning: 'Technical evaluation 70% complete. Awaiting pilot results from Phase 1 deployment.',
    riskAssessment: {
      overall: 'medium',
      financial: 'medium',
      operational: 'medium',
      reputational: 'low',
      factors: [
        'AI accuracy in Arabic language requires validation',
        'Integration with legacy systems complex',
        'Strong citizen feedback from pilot',
      ],
    },
  },
  {
    id: 'dec-012',
    title: 'Executive Strategy Retreat',
    description: 'Annual strategic planning retreat for DGE leadership team. Two-day offsite at Zaya Nurai Island.',
    category: 'hr',
    level: 1,
    status: 'completed',
    ceoPillar: 'personal_effectiveness',
    requesterId: 'stake-1',
    departmentId: 'dept-1',
    value: 95000,
    dueDate: '2026-01-10',
    createdAt: '2026-01-02T10:00:00Z',
    updatedAt: '2026-01-10T18:00:00Z',
    authorityBarometer: buildAuthority(
      1,
      'auto',
      97,
      ['Annual recurring event', 'Within executive budget', 'Low external exposure'],
      '2026-01-10T18:00:00Z'
    ),
    adeoFlow: buildAdeoFlow(6, {
      5: 'Approved under delegated authority',
    }),
    aiRecommendation: 'approve',
    aiConfidence: 99,
    aiReasoning: 'Annual approved event within executive budget allocation.',
  },
  {
    id: 'dec-013',
    title: 'Electric Vehicle Fleet Transition',
    description: 'Replace 12 government vehicles with electric alternatives as part of Abu Dhabi sustainability commitment. Includes charging infrastructure installation.',
    category: 'procurement',
    level: 2,
    status: 'incoming',
    ceoPillar: 'operational_alignment',
    requesterId: 'stake-4',
    departmentId: 'dept-4',
    value: 2400000,
    dueDate: '2026-02-05',
    createdAt: '2026-01-19T07:00:00Z',
    updatedAt: '2026-01-19T07:00:00Z',
    authorityBarometer: buildAuthority(
      2,
      'review',
      64,
      ['Sustainability mandate', 'Capital expenditure review', 'Fleet operational impact'],
      '2026-01-19T07:00:00Z'
    ),
    adeoFlow: buildAdeoFlow(0, {
      0: 'Submitted for intake',
    }),
  },
  {
    id: 'dec-014',
    title: 'Responsible AI Governance Framework',
    description: 'Adoption of comprehensive AI governance framework including ethical guidelines, audit requirements, bias monitoring, and transparency standards for all DGE AI deployments.',
    category: 'policy',
    level: 3,
    status: 'awaiting_review',
    ceoPillar: 'board_engagement',
    requesterId: 'stake-10',
    departmentId: 'dept-3',
    dueDate: '2026-01-31',
    createdAt: '2026-01-08T14:00:00Z',
    updatedAt: '2026-01-18T16:00:00Z',
    authorityBarometer: buildAuthority(
      3,
      'chairman',
      92,
      ['Government-wide governance impact', 'Regulatory sensitivity', 'Cross-entity standards'],
      '2026-01-18T16:00:00Z'
    ),
    adeoFlow: buildAdeoFlow(4, {
      4: 'Scoring and prioritization underway',
    }),
    aiRecommendation: 'approve',
    aiConfidence: 96,
    aiReasoning: 'Comprehensive framework developed with international best practices. Stakeholder consultation complete. Essential foundation for Agent-0 and future AI initiatives.',
    riskAssessment: {
      overall: 'low',
      financial: 'low',
      operational: 'low',
      reputational: 'low',
      factors: [
        'Establishes clear governance structure',
        'Positions Abu Dhabi as regional AI governance leader',
        'Required for responsible AI deployment',
      ],
    },
    stakeholderImpact: [
      { stakeholderId: 'stake-10', impact: 'positive', notes: 'Led framework development' },
      { stakeholderId: 'stake-7', impact: 'positive', notes: 'ADDA endorses standards' },
      { stakeholderId: 'stake-1', impact: 'positive', notes: 'Undersecretary sponsored initiative' },
    ],
  },
  {
    id: 'dec-015',
    title: 'Citizen Feedback Portal Enhancement',
    description: 'Upgrade citizen feedback system with sentiment analysis, automated routing, and real-time dashboards for government entities.',
    category: 'infrastructure',
    level: 2,
    status: 'in_execution',
    ceoPillar: 'communications',
    requesterId: 'stake-3',
    departmentId: 'dept-3',
    value: 680000,
    dueDate: '2026-01-20',
    createdAt: '2026-01-06T09:00:00Z',
    updatedAt: '2026-01-17T11:00:00Z',
    authorityBarometer: buildAuthority(
      2,
      'review',
      78,
      ['Public sentiment impact', 'Operational readiness', 'Data privacy safeguards'],
      '2026-01-17T11:00:00Z'
    ),
    adeoFlow: buildAdeoFlow(5, {
      5: 'Committee decision captured, execution underway',
    }),
    aiRecommendation: 'approve',
    aiConfidence: 95,
    aiReasoning: 'Phase 1 pilot successful with 87% accuracy in sentiment classification. Ready for full deployment.',
  },
];

const precedentDecisions: Decision[] = [
  {
    id: 'prec-1',
    title: 'TAMM Platform Launch 2019',
    description: 'Initial unified services rollout covering 250 government services across key entities.',
    category: 'strategic',
    level: 2,
    status: 'completed',
    isPrecedent: true,
    ceoPillar: 'priority_setting',
    requesterId: 'stake-3',
    departmentId: 'dept-3',
    value: 18000000,
    dueDate: '2019-04-15',
    createdAt: '2019-02-10T08:00:00Z',
    updatedAt: '2019-04-15T18:00:00Z',
    aiRecommendation: 'approve',
    aiConfidence: 94,
    aiReasoning: 'Strategic platform launch validated by cross-entity alignment and funding approvals.',
  },
  {
    id: 'prec-2',
    title: 'Government Services Integration 2022',
    description: 'Cross-entity integration of citizen services and unified data services.',
    category: 'strategic',
    level: 2,
    status: 'completed',
    isPrecedent: true,
    ceoPillar: 'operational_alignment',
    requesterId: 'stake-7',
    departmentId: 'dept-3',
    value: 12000000,
    dueDate: '2022-09-20',
    createdAt: '2022-07-05T09:00:00Z',
    updatedAt: '2022-09-20T17:00:00Z',
    aiRecommendation: 'approve',
    aiConfidence: 88,
    aiReasoning: 'Integration milestones met with clear service-level improvements.',
  },
  {
    id: 'prec-3',
    title: 'Healthcare Data Integration 2024',
    description: 'Integration of health records across Abu Dhabi healthcare providers.',
    category: 'policy',
    level: 3,
    status: 'completed',
    isPrecedent: true,
    ceoPillar: 'operational_alignment',
    requesterId: 'stake-10',
    departmentId: 'dept-3',
    value: 0,
    dueDate: '2024-03-10',
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2024-03-10T16:00:00Z',
    aiRecommendation: 'approve',
    aiConfidence: 82,
    aiReasoning: 'Governance requirements satisfied with high stakeholder alignment.',
  },
  {
    id: 'prec-4',
    title: 'Excellence Awards 2025',
    description: 'Annual budget allocation for the government excellence awards program.',
    category: 'budget',
    level: 2,
    status: 'completed',
    isPrecedent: true,
    ceoPillar: 'operational_alignment',
    requesterId: 'stake-2',
    departmentId: 'dept-2',
    value: 3100000,
    dueDate: '2025-01-18',
    createdAt: '2024-11-10T10:00:00Z',
    updatedAt: '2025-01-18T12:00:00Z',
    aiRecommendation: 'approve',
    aiConfidence: 97,
    aiReasoning: 'Repeat program with consistent ROI and stakeholder endorsement.',
  },
  {
    id: 'prec-5',
    title: 'Excellence Awards 2024',
    description: 'Previous annual awards cycle funding decision and execution.',
    category: 'budget',
    level: 2,
    status: 'completed',
    isPrecedent: true,
    ceoPillar: 'operational_alignment',
    requesterId: 'stake-2',
    departmentId: 'dept-2',
    value: 2950000,
    dueDate: '2024-01-15',
    createdAt: '2023-11-05T10:00:00Z',
    updatedAt: '2024-01-15T12:00:00Z',
    aiRecommendation: 'approve',
    aiConfidence: 96,
    aiReasoning: 'Program delivered within budget and met recognition targets.',
  },
];

const getExecutionOwner = (decision: Decision) => {
  if (decision.level === 3) return 'Executive Delivery Office';
  if (decision.category === 'procurement') return 'Procurement PMO';
  if (decision.category === 'policy') return 'Policy Governance Office';
  if (decision.category === 'hr') return 'People Operations';
  if (decision.category === 'strategic') return 'Strategy Execution Office';
  return 'Delivery PMO';
};

const allDecisions = [...baseDecisions, ...precedentDecisions];

export const decisions: Decision[] = allDecisions.map((decision, index) => {
  const aiRecommendation = decision.aiRecommendation ?? getDefaultRecommendation(decision);
  const aiConfidence = decision.aiConfidence ?? getDefaultConfidence(index);
  const aiReasoning = decision.aiReasoning ?? buildDefaultReasoning(decision);

  return {
    ...decision,
    aiRecommendation,
    aiConfidence,
    aiReasoning,
    riskAssessment: decision.riskAssessment ?? buildDefaultRiskAssessment(decision),
    authorityBarometer: decision.authorityBarometer ?? buildDefaultAuthority({ ...decision, aiConfidence }),
    adeoFlow: decision.adeoFlow ?? buildDefaultAdeoFlow(decision),
    precedents: decision.precedents ?? [],
    stakeholderImpact: decision.stakeholderImpact ?? [],
    route: decision.route ?? buildRoute(decision.status, decision.updatedAt),
    triage: decision.triage ?? buildTriage(decision.level, (index % 5) + 1, decision.status),
    execution: decision.execution ?? buildExecution(decision.status, getExecutionOwner(decision)),
    outcome: decision.outcome ?? buildOutcome(decision.status),
    workflowSteps: decision.workflowSteps ?? buildWorkflowSteps(decision.status),
  };
});

export const getDecisionById = (id: string): Decision | undefined => {
  return decisions.find(d => d.id === id);
};

export const getDecisionsByStatus = (status: Decision['status']): Decision[] => {
  return decisions.filter(d => d.status === status && !d.isPrecedent);
};

export const getDecisionsByLevel = (level: Decision['level']): Decision[] => {
  return decisions.filter(d => d.level === level && !d.isPrecedent);
};

export const getPendingDecisionsForChairman = (): Decision[] => {
  return decisions.filter(d => d.status === 'with_chairman' && !d.isPrecedent);
};

export const getPendingDecisionsForUndersecretary = (): Decision[] => {
  return decisions.filter(d =>
    !d.isPrecedent &&
    (
      d.status === 'awaiting_review' ||
      d.status === 'in_analysis' ||
      d.status === 'incoming'
    )
  );
};

export const getDecisionAnalytics = () => {
  const activeDecisions = decisions.filter(d => !d.isPrecedent);
  return {
    total: activeDecisions.length,
    byStatus: {
      incoming: activeDecisions.filter(d => d.status === 'incoming').length,
      in_analysis: activeDecisions.filter(d => d.status === 'in_analysis').length,
      awaiting_review: activeDecisions.filter(d => d.status === 'awaiting_review').length,
      with_chairman: activeDecisions.filter(d => d.status === 'with_chairman').length,
      in_execution: activeDecisions.filter(d => d.status === 'in_execution').length,
      completed: activeDecisions.filter(d => d.status === 'completed').length,
    },
    byLevel: {
      1: activeDecisions.filter(d => d.level === 1).length,
      2: activeDecisions.filter(d => d.level === 2).length,
      3: activeDecisions.filter(d => d.level === 3).length,
    },
    totalValue: activeDecisions.reduce((sum, d) => sum + (d.value || 0), 0),
  };
};
