import { Workflow, DataSource, ActivityLogEntry, AuthorityBarometerConfig } from '../types';

export const workflows: Workflow[] = [
  {
    id: 'wf-001',
    name: 'Standard Decision Workflow',
    description: 'Default workflow for decisions. Routes based on value thresholds and category to appropriate authority level.',
    isActive: true,
    createdAt: '2025-10-15T10:00:00Z',
    updatedAt: '2026-01-15T14:00:00Z',
    nodes: [
      {
        id: 'node-1',
        type: 'intake',
        label: 'Request Intake',
        config: { sources: ['email', 'tamm', 'manual'], keywords: ['approval', 'decision', 'request'] },
        position: { x: 100, y: 200 },
      },
      {
        id: 'node-2',
        type: 'classifier',
        label: 'Authority Classification',
        config: {
          rules: [
            { condition: 'value < 100000', level: 1 },
            { condition: 'value >= 100000 && value < 25000000', level: 2 },
            { condition: 'value >= 25000000', level: 3 },
          ],
        },
        position: { x: 300, y: 200 },
      },
      {
        id: 'node-3',
        type: 'context',
        label: 'Context Assembly',
        config: {
          sources: ['knowledge_graph', 'oracle_erp', 'document_store'],
          timeout: 300,
        },
        position: { x: 500, y: 200 },
      },
      {
        id: 'node-4',
        type: 'analysis',
        label: 'AI Analysis',
        config: {
          model: 'agent-0-decision',
          includeRiskAssessment: true,
          includePrecedents: true,
          confidenceThreshold: 0.7,
        },
        position: { x: 700, y: 200 },
      },
      {
        id: 'node-5a',
        type: 'execution',
        label: 'Autonomous (L1)',
        config: { requiresApproval: false, notifyRequester: true },
        position: { x: 900, y: 100 },
      },
      {
        id: 'node-5b',
        type: 'human_review',
        label: 'Undersecretary (L2)',
        config: { assignee: 'undersecretary', escalationTimeout: 48 },
        position: { x: 900, y: 200 },
      },
      {
        id: 'node-5c',
        type: 'human_review',
        label: 'Chairman (L3)',
        config: { assignee: 'chairman', prepareBriefing: true },
        position: { x: 900, y: 300 },
      },
      {
        id: 'node-6',
        type: 'execution',
        label: 'Execute Decision',
        config: {
          actions: ['update_systems', 'notify_stakeholders', 'create_audit_trail'],
        },
        position: { x: 1100, y: 200 },
      },
      {
        id: 'node-7',
        type: 'notification',
        label: 'Close & Track',
        config: { channels: ['email', 'tamm'], trackOutcome: true },
        position: { x: 1300, y: 200 },
      },
    ],
    edges: [
      { id: 'e1', source: 'node-1', target: 'node-2' },
      { id: 'e2', source: 'node-2', target: 'node-3' },
      { id: 'e3', source: 'node-3', target: 'node-4' },
      { id: 'e4a', source: 'node-4', target: 'node-5a', label: 'Level 1', condition: 'level === 1' },
      { id: 'e4b', source: 'node-4', target: 'node-5b', label: 'Level 2', condition: 'level === 2' },
      { id: 'e4c', source: 'node-4', target: 'node-5c', label: 'Level 3', condition: 'level === 3' },
      { id: 'e5a', source: 'node-5a', target: 'node-6' },
      { id: 'e5b', source: 'node-5b', target: 'node-6', label: 'Approved' },
      { id: 'e5c', source: 'node-5c', target: 'node-6', label: 'Approved' },
      { id: 'e6', source: 'node-6', target: 'node-7' },
    ],
  },
  {
    id: 'wf-002',
    name: 'Policy Consultation Workflow',
    description: 'Workflow for policy changes requiring multi-stakeholder consultation before leadership approval.',
    isActive: true,
    createdAt: '2025-11-20T09:00:00Z',
    updatedAt: '2026-01-10T11:00:00Z',
    nodes: [
      {
        id: 'node-1',
        type: 'intake',
        label: 'Policy Draft',
        config: { sources: ['document', 'manual'], documentTypes: ['policy', 'framework'] },
        position: { x: 100, y: 200 },
      },
      {
        id: 'node-2',
        type: 'context',
        label: 'Impact Assessment',
        config: { sources: ['knowledge_graph', 'hr_system', 'entity_data'] },
        position: { x: 300, y: 200 },
      },
      {
        id: 'node-3',
        type: 'notification',
        label: 'Stakeholder Review',
        config: { collectFeedback: true, deadline: 72 },
        position: { x: 500, y: 200 },
      },
      {
        id: 'node-4',
        type: 'analysis',
        label: 'Feedback Synthesis',
        config: { model: 'agent-0-analysis', summarizeFeedback: true },
        position: { x: 700, y: 200 },
      },
      {
        id: 'node-5',
        type: 'human_review',
        label: 'Leadership Approval',
        config: { assignee: 'undersecretary', escalateToChairman: true },
        position: { x: 900, y: 200 },
      },
      {
        id: 'node-6',
        type: 'execution',
        label: 'Publish & Communicate',
        config: { publishTo: ['intranet', 'tamm'], notifyAll: true },
        position: { x: 1100, y: 200 },
      },
    ],
    edges: [
      { id: 'e1', source: 'node-1', target: 'node-2' },
      { id: 'e2', source: 'node-2', target: 'node-3' },
      { id: 'e3', source: 'node-3', target: 'node-4' },
      { id: 'e4', source: 'node-4', target: 'node-5' },
      { id: 'e5', source: 'node-5', target: 'node-6', label: 'Approved' },
    ],
  },
  {
    id: 'wf-003',
    name: 'Urgent Response Protocol',
    description: 'Fast-track workflow for time-sensitive matters requiring immediate leadership attention.',
    isActive: true,
    createdAt: '2025-12-01T08:00:00Z',
    updatedAt: '2026-01-05T16:00:00Z',
    nodes: [
      {
        id: 'node-1',
        type: 'intake',
        label: 'Urgent Trigger',
        config: { sources: ['alert', 'manual'], priority: 'urgent' },
        position: { x: 100, y: 200 },
      },
      {
        id: 'node-2',
        type: 'notification',
        label: 'Alert Leadership',
        config: { channels: ['sms', 'call', 'email'], immediate: true },
        position: { x: 300, y: 200 },
      },
      {
        id: 'node-3',
        type: 'context',
        label: 'Rapid Brief',
        config: { timeout: 60, essentialOnly: true },
        position: { x: 500, y: 200 },
      },
      {
        id: 'node-4',
        type: 'human_review',
        label: 'Chairman Decision',
        config: { assignee: 'chairman', bypassQueue: true },
        position: { x: 700, y: 200 },
      },
      {
        id: 'node-5',
        type: 'execution',
        label: 'Execute',
        config: { parallel: true, trackInRealtime: true },
        position: { x: 900, y: 200 },
      },
    ],
    edges: [
      { id: 'e1', source: 'node-1', target: 'node-2' },
      { id: 'e2', source: 'node-2', target: 'node-3' },
      { id: 'e3', source: 'node-3', target: 'node-4' },
      { id: 'e4', source: 'node-4', target: 'node-5' },
    ],
  },
];

export const dataSources: DataSource[] = [
  {
    id: 'ds-001',
    name: 'Oracle ERP',
    type: 'oracle_fusion',
    status: 'connected',
    lastSync: '2026-01-19T06:00:00Z',
    documentsCount: 45230,
    entitiesCount: 12450,
  },
  {
    id: 'ds-002',
    name: 'TAMM Platform',
    type: 'tamm',
    status: 'connected',
    lastSync: '2026-01-19T05:30:00Z',
    documentsCount: 28920,
    entitiesCount: 8200,
  },
  {
    id: 'ds-003',
    name: 'Document Repository',
    type: 'sharepoint',
    status: 'syncing',
    lastSync: '2026-01-19T04:00:00Z',
    documentsCount: 156780,
    entitiesCount: 28900,
  },
  {
    id: 'ds-004',
    name: 'Communication Archive',
    type: 'email',
    status: 'connected',
    lastSync: '2026-01-19T06:15:00Z',
    documentsCount: 234500,
    entitiesCount: 45600,
  },
  {
    id: 'ds-005',
    name: 'Calendar System',
    type: 'calendar',
    status: 'connected',
    lastSync: '2026-01-19T06:20:00Z',
    documentsCount: 12340,
    entitiesCount: 5670,
  },
];

export const activityLog: ActivityLogEntry[] = [
  {
    id: 'log-001',
    timestamp: '2026-01-19T08:45:00Z',
    type: 'classification',
    decisionId: 'dec-013',
    description: 'Classified: Electric Vehicle Fleet Transition as Level 2',
    details: {
      category: 'procurement',
      value: 2400000,
      assignedLevel: 2,
      confidence: 0.94,
    },
    confidence: 94,
  },
  {
    id: 'log-002',
    timestamp: '2026-01-19T08:30:00Z',
    type: 'analysis',
    decisionId: 'dec-003',
    description: 'Analysis completed: Excellence Awards Budget',
    details: {
      recommendation: 'approve',
      riskLevel: 'low',
      precedentsFound: 2,
    },
    confidence: 94,
  },
  {
    id: 'log-003',
    timestamp: '2026-01-19T08:15:00Z',
    type: 'recommendation',
    decisionId: 'dec-001',
    description: 'Recommendation: TAMM 5.0 Platform - Approve',
    details: {
      confidence: 0.89,
      keyFactors: ['Strategic alignment', 'Budget availability', 'ADDA endorsement'],
    },
    confidence: 89,
  },
  {
    id: 'log-004',
    timestamp: '2026-01-19T07:45:00Z',
    type: 'escalation',
    decisionId: 'dec-002',
    description: 'Escalated: Data Sharing Framework L2 → L3',
    details: {
      reason: 'Privacy governance implications',
      barometerTrigger: 'stakeholder_impact',
      originalLevel: 2,
      newLevel: 3,
    },
  },
  {
    id: 'log-005',
    timestamp: '2026-01-19T07:00:00Z',
    type: 'execution',
    decisionId: 'dec-007',
    description: 'Auto-executed: Q1 Office Supplies',
    details: {
      action: 'approved',
      notificationsSent: 3,
      auditTrailCreated: true,
    },
    confidence: 99,
  },
  {
    id: 'log-006',
    timestamp: '2026-01-18T17:30:00Z',
    type: 'override',
    decisionId: 'dec-006',
    description: 'Modified: Oracle renewal terms adjusted',
    details: {
      modifier: 'Undersecretary',
      originalRecommendation: 'approve',
      modification: 'Added quarterly review clause',
    },
  },
  {
    id: 'log-007',
    timestamp: '2026-01-18T16:00:00Z',
    type: 'analysis',
    decisionId: 'dec-005',
    description: 'In progress: Emiratization Program analysis',
    details: {
      status: 'gathering_data',
      pendingItems: ['University confirmations', 'Capacity assessment'],
    },
    confidence: 72,
  },
  {
    id: 'log-008',
    timestamp: '2026-01-18T14:30:00Z',
    type: 'classification',
    decisionId: 'dec-014',
    description: 'Classified: AI Governance Framework as Level 3',
    details: {
      category: 'policy',
      assignedLevel: 3,
      reason: 'Organization-wide policy with strategic implications',
    },
    confidence: 96,
  },
  {
    id: 'log-009',
    timestamp: '2026-01-18T11:00:00Z',
    type: 'recommendation',
    decisionId: 'dec-004',
    description: 'Recommendation: Shared Services - Approve',
    details: {
      confidence: 0.86,
      conditions: ['Implementation timeline review', 'Change management plan'],
    },
    confidence: 86,
  },
  {
    id: 'log-010',
    timestamp: '2026-01-18T09:00:00Z',
    type: 'execution',
    decisionId: 'dec-009',
    description: 'Auto-executed: Leadership Development Workshop',
    details: {
      action: 'approved',
      enrollmentsCreated: 25,
    },
    confidence: 98,
  },
];

export const authorityConfig: AuthorityBarometerConfig = {
  volatilitySensitivity: 65,
  stakeholderImpactWeight: 75,
  precedentConfidenceThreshold: 70,
  autoEscalateOnCrisis: true,
};

export const authorityThresholds = {
  level1: {
    maxValue: 100000,
    categories: ['procurement', 'hr'],
    requiresPrecedent: false,
  },
  level2: {
    minValue: 100000,
    maxValue: 25000000,
    categories: ['procurement', 'budget', 'partnership', 'policy'],
    requiresPrecedent: true,
  },
  level3: {
    minValue: 25000000,
    categories: ['strategic', 'infrastructure'],
    alwaysEscalate: ['crisis', 'restructuring', 'executive_appointment'],
  },
};

export const getWorkflowById = (id: string): Workflow | undefined => {
  return workflows.find(w => w.id === id);
};

export const getActiveWorkflows = (): Workflow[] => {
  return workflows.filter(w => w.isActive);
};

export const getRecentActivity = (limit: number = 10): ActivityLogEntry[] => {
  return activityLog.slice(0, limit);
};
