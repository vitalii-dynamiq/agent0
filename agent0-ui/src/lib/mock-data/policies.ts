import { DecisionCategory, Policy, PolicyRule } from '../types';

export const policies: Policy[] = [
  {
    id: 'policy-001',
    name: 'Data Sovereignty Policy',
    description: 'Guidelines for data storage and processing within UAE borders, ensuring compliance with federal data protection requirements',
    category: 'compliance',
    status: 'active',
    rules: [
      {
        id: 'rule-001-1',
        condition: 'data.classification === "confidential" || data.classification === "secret"',
        action: 'Store exclusively on UAE-based sovereign infrastructure',
        priority: 1,
      },
      {
        id: 'rule-001-2',
        condition: 'data.containsPII === true',
        action: 'Apply encryption at rest and in transit, limit access to authorized personnel',
        priority: 2,
      },
      {
        id: 'rule-001-3',
        condition: 'data.crossBorderTransfer === true',
        action: 'Require explicit approval from Data Protection Officer',
        priority: 1,
      },
    ],
    applicableDepartments: ['dept-1', 'dept-2', 'dept-3', 'dept-4'],
    applicableDecisionTypes: ['strategic', 'policy', 'infrastructure'],
    effectiveDate: '2025-06-01',
    version: 2.1,
    createdBy: 'H.E. Mohammed Al Gergawi',
    createdAt: '2025-05-01T00:00:00Z',
    updatedAt: '2025-12-15T00:00:00Z',
  },
  {
    id: 'policy-002',
    name: 'AI Governance Framework',
    description: 'Ethical AI usage guidelines, decision transparency requirements, and human oversight mandates',
    category: 'governance',
    status: 'active',
    rules: [
      {
        id: 'rule-002-1',
        condition: 'decision.aiConfidence < 0.75',
        action: 'Escalate to human review regardless of authority level',
        priority: 1,
      },
      {
        id: 'rule-002-2',
        condition: 'decision.level === 3',
        action: 'AI provides advisory only, human makes final decision',
        priority: 1,
      },
      {
        id: 'rule-002-3',
        condition: 'decision.affectsPublic === true',
        action: 'Require explainability report and impact assessment',
        priority: 2,
      },
      {
        id: 'rule-002-4',
        condition: 'agent.accuracyScore < 0.85',
        action: 'Trigger retraining workflow and increase human oversight',
        priority: 1,
      },
    ],
    applicableDepartments: ['dept-4'],
    applicableDecisionTypes: ['strategic', 'policy', 'hr'],
    effectiveDate: '2025-09-01',
    version: 1.5,
    createdBy: 'Fatima Al Zaabi',
    createdAt: '2025-08-01T00:00:00Z',
    updatedAt: '2026-01-10T00:00:00Z',
  },
  {
    id: 'policy-003',
    name: 'Procurement Authority Matrix',
    description: 'Decision authority levels and approval requirements for procurement activities based on value and category',
    category: 'financial',
    status: 'active',
    rules: [
      {
        id: 'rule-003-1',
        condition: 'procurement.value < 100000',
        action: 'Level 1: Auto-approve with audit trail',
        priority: 1,
      },
      {
        id: 'rule-003-2',
        condition: 'procurement.value >= 100000 && procurement.value < 25000000',
        action: 'Level 2: Requires Undersecretary approval',
        priority: 1,
      },
      {
        id: 'rule-003-3',
        condition: 'procurement.value >= 25000000',
        action: 'Level 3: Requires Chairman approval',
        priority: 1,
      },
      {
        id: 'rule-003-4',
        condition: 'procurement.vendor.isNew === true && procurement.value >= 50000',
        action: 'Require vendor due diligence and compliance check',
        priority: 2,
      },
    ],
    applicableDepartments: ['dept-1', 'dept-2', 'dept-3', 'dept-4'],
    applicableDecisionTypes: ['procurement'],
    effectiveDate: '2025-01-01',
    version: 3.0,
    createdBy: 'Omar Hassan',
    createdAt: '2024-11-01T00:00:00Z',
    updatedAt: '2025-12-01T00:00:00Z',
  },
  {
    id: 'policy-004',
    name: 'Human Capital Decision Framework',
    description: 'Guidelines for HR-related decisions including hiring, promotions, and organizational changes',
    category: 'hr',
    status: 'active',
    rules: [
      {
        id: 'rule-004-1',
        condition: 'hr.position.level >= "director"',
        action: 'Escalate to Level 3 for Chairman review',
        priority: 1,
      },
      {
        id: 'rule-004-2',
        condition: 'hr.type === "restructuring" && hr.affectedCount >= 10',
        action: 'Require comprehensive impact assessment and stakeholder consultation',
        priority: 1,
      },
      {
        id: 'rule-004-3',
        condition: 'hr.type === "hiring" && hr.position.department === "Technology"',
        action: 'Include Head of AI in interview panel',
        priority: 3,
      },
    ],
    applicableDepartments: ['dept-1', 'dept-2', 'dept-3', 'dept-4'],
    applicableDecisionTypes: ['hr'],
    effectiveDate: '2025-03-01',
    version: 2.0,
    createdBy: 'Dr. Sarah Al Rashid',
    createdAt: '2025-02-01T00:00:00Z',
    updatedAt: '2025-11-15T00:00:00Z',
  },
  {
    id: 'policy-005',
    name: 'Crisis Response Protocol',
    description: 'Emergency decision-making procedures during crisis situations',
    category: 'operational',
    status: 'active',
    rules: [
      {
        id: 'rule-005-1',
        condition: 'crisis.severity === "critical"',
        action: 'Bypass standard workflow, escalate directly to Chairman with immediate notification',
        priority: 1,
      },
      {
        id: 'rule-005-2',
        condition: 'crisis.type === "security"',
        action: 'Engage cybersecurity response team and notify NCEMA',
        priority: 1,
      },
      {
        id: 'rule-005-3',
        condition: 'crisis.affectsPublicServices === true',
        action: 'Activate citizen communication protocol',
        priority: 2,
      },
    ],
    applicableDepartments: ['dept-1', 'dept-2', 'dept-3', 'dept-4'],
    applicableDecisionTypes: ['strategic', 'infrastructure', 'policy'],
    effectiveDate: '2025-04-01',
    version: 1.3,
    createdBy: 'H.E. Mohammed Al Gergawi',
    createdAt: '2025-03-15T00:00:00Z',
    updatedAt: '2025-10-01T00:00:00Z',
  },
  {
    id: 'policy-006',
    name: 'Partnership & MOU Framework',
    description: 'Guidelines for establishing and managing external partnerships and memoranda of understanding',
    category: 'governance',
    status: 'active',
    rules: [
      {
        id: 'rule-006-1',
        condition: 'partnership.type === "international"',
        action: 'Require MOFA coordination and Executive Council notification',
        priority: 1,
      },
      {
        id: 'rule-006-2',
        condition: 'partnership.financialCommitment >= 5000000',
        action: 'Escalate to Level 3 and require Finance review',
        priority: 1,
      },
      {
        id: 'rule-006-3',
        condition: 'partnership.dataSharing === true',
        action: 'Apply Data Sovereignty Policy requirements',
        priority: 2,
      },
    ],
    applicableDepartments: ['dept-1', 'dept-2'],
    applicableDecisionTypes: ['partnership', 'strategic'],
    effectiveDate: '2025-07-01',
    version: 1.1,
    createdBy: 'Dr. Sarah Al Rashid',
    createdAt: '2025-06-15T00:00:00Z',
    updatedAt: '2025-12-20T00:00:00Z',
  },
  {
    id: 'policy-007',
    name: 'Budget Reallocation Guidelines',
    description: 'Rules for budget transfers and reallocations between departments and projects',
    category: 'financial',
    status: 'under_review',
    rules: [
      {
        id: 'rule-007-1',
        condition: 'budget.reallocation.percentage <= 5',
        action: 'Department head can approve with Finance notification',
        priority: 1,
      },
      {
        id: 'rule-007-2',
        condition: 'budget.reallocation.percentage > 5 && budget.reallocation.percentage <= 15',
        action: 'Requires Undersecretary and CFO approval',
        priority: 1,
      },
      {
        id: 'rule-007-3',
        condition: 'budget.reallocation.percentage > 15',
        action: 'Requires Chairman approval and Executive Council notification',
        priority: 1,
      },
    ],
    applicableDepartments: ['dept-1', 'dept-2', 'dept-3', 'dept-4'],
    applicableDecisionTypes: ['budget'],
    effectiveDate: '2026-02-01',
    version: 2.0,
    createdBy: 'Omar Hassan',
    createdAt: '2025-12-01T00:00:00Z',
    updatedAt: '2026-01-15T00:00:00Z',
  },
];

// Helper functions
export const getPolicyById = (id: string): Policy | undefined => 
  policies.find(p => p.id === id);

export const getPoliciesByCategory = (category: Policy['category']): Policy[] => 
  policies.filter(p => p.category === category);

export const getPoliciesByStatus = (status: Policy['status']): Policy[] => 
  policies.filter(p => p.status === status);

export const getActivePolicies = (): Policy[] => 
  policies.filter(p => p.status === 'active');

export const getPoliciesForDecisionType = (type: DecisionCategory): Policy[] => 
  policies.filter(p => p.applicableDecisionTypes.includes(type));
