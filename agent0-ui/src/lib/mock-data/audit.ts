import { AuditEntry } from '../types';

export const auditEntries: AuditEntry[] = [
  // TAMM 5.0 Platform Decision Audit Trail
  {
    id: 'audit-001',
    decisionId: 'dec-001',
    timestamp: '2026-01-08T08:00:00Z',
    action: 'decision_created',
    actor: 'human',
    actorId: 'stake-3',
    actorName: 'Ahmed Al Mansoori',
    details: {
      reasoning: 'Submitted TAMM 5.0 Platform Development request for Phase 2 approval',
    },
  },
  {
    id: 'audit-002',
    decisionId: 'dec-001',
    timestamp: '2026-01-08T08:02:15Z',
    action: 'context_retrieved',
    actor: 'ai',
    actorId: 'agent-context',
    details: {
      contextRetrieved: [
        'SharePoint • Abu Dhabi Digital Strategy 2025-2030 (85% relevance)',
        'SharePoint • TAMM Phase 1 Post-Implementation Review (92% relevance)',
        'Oracle Fusion • FY2026 Budget Proposal - Digital Transformation allocation',
        'Teams Transcript • Weekly Leadership Majlis highlights',
        'Decision Archive • TAMM precedents (2019-2025)',
      ],
      reasoning: 'Retrieved 47 relevant documents and 12 connected entities from knowledge graph',
      confidence: 94,
    },
  },
  {
    id: 'audit-003',
    decisionId: 'dec-001',
    timestamp: '2026-01-08T08:03:45Z',
    action: 'precedents_matched',
    actor: 'ai',
    actorId: 'agent-decision',
    details: {
      precedentsMatched: [
        { id: 'prec-1', title: 'TAMM Platform Launch 2019', similarity: 92 },
        { id: 'prec-2', title: 'Government Services Integration 2022', similarity: 78 },
        { id: 'prec-3', title: 'Digital Services Enhancement 2024', similarity: 71 },
      ],
      reasoning: 'Found 3 highly similar precedents, all resulted in approval',
      confidence: 89,
    },
  },
  {
    id: 'audit-004',
    decisionId: 'dec-001',
    timestamp: '2026-01-08T08:05:30Z',
    action: 'risk_assessed',
    actor: 'ai',
    actorId: 'agent-analysis',
    details: {
      riskFactors: [
        'Multi-year commitment requires sustained funding (Medium)',
        'Technical complexity manageable with existing team (Low)',
        'Strong vendor ecosystem in place (Low)',
        'Integration with legacy systems (Medium)',
      ],
      reasoning: 'Overall risk assessed as Medium. Financial risk is primary concern due to 3-year commitment, but aligned with approved digital transformation budget.',
      confidence: 87,
    },
  },
  {
    id: 'audit-005',
    decisionId: 'dec-001',
    timestamp: '2026-01-08T08:06:00Z',
    action: 'policy_applied',
    actor: 'ai',
    actorId: 'agent-routing',
    details: {
      policyApplied: 'Procurement Authority Matrix v3.0',
      reasoning: 'Value of AED 42M exceeds Level 2 threshold of AED 25M. Routed to Level 3 (Chairman) per policy rule-003-3.',
      confidence: 99,
    },
  },
  {
    id: 'audit-006',
    decisionId: 'dec-001',
    timestamp: '2026-01-08T08:07:00Z',
    action: 'recommendation_generated',
    actor: 'ai',
    actorId: 'agent-decision',
    details: {
      reasoning: 'RECOMMEND APPROVAL: Strong alignment with Abu Dhabi Digital Strategy. Phase 1 achieved 94% citizen satisfaction. ADDA endorsement received. Budget within allocated transformation fund. Historical precedents strongly supportive (3/3 similar decisions approved). Risk profile acceptable.',
      confidence: 89,
      previousValue: null,
      newValue: 'approve',
    },
  },
  {
    id: 'audit-007',
    decisionId: 'dec-001',
    timestamp: '2026-01-10T09:30:00Z',
    action: 'human_review_started',
    actor: 'human',
    actorId: 'stake-2',
    actorName: 'Dr. Sarah Al Rashid',
    details: {
      reasoning: 'Undersecretary reviewed AI analysis and prepared briefing for Chairman',
    },
  },
  {
    id: 'audit-007b',
    decisionId: 'dec-001',
    timestamp: '2026-01-10T10:10:00Z',
    action: 'feedback_submitted',
    actor: 'human',
    actorId: 'stake-1',
    actorName: 'H.E. Mohammed Al Gergawi',
    details: {
      reasoning: 'Requested phased approval pending updated delivery timeline and risk mitigation plan.',
      previousValue: 'approve',
      newValue: 'defer',
      confidence: 71,
    },
    metadata: {
      overrideType: 'executive_override',
    },
  },
  // Cross-Entity Data Sharing Framework Audit Trail
  {
    id: 'audit-008',
    decisionId: 'dec-002',
    timestamp: '2026-01-10T09:00:00Z',
    action: 'decision_created',
    actor: 'human',
    actorId: 'stake-2',
    actorName: 'Dr. Sarah Al Rashid',
    details: {
      reasoning: 'Submitted Cross-Entity Data Sharing Framework for executive approval',
    },
  },
  {
    id: 'audit-009',
    decisionId: 'dec-002',
    timestamp: '2026-01-10T09:02:00Z',
    action: 'context_retrieved',
    actor: 'ai',
    actorId: 'agent-context',
    details: {
      contextRetrieved: [
        'Data Sovereignty Policy v2.1 (98% relevance)',
        'AI Governance Framework v1.5 (85% relevance)',
        'Federal Data Protection Law 2023',
        'Inter-entity data sharing precedents',
        'NCEMA data classification guidelines',
      ],
      reasoning: 'Critical policy alignment required. Retrieved 32 relevant documents.',
      confidence: 91,
    },
  },
  {
    id: 'audit-010',
    decisionId: 'dec-002',
    timestamp: '2026-01-10T09:04:00Z',
    action: 'risk_assessed',
    actor: 'ai',
    actorId: 'agent-analysis',
    details: {
      riskFactors: [
        'Data sovereignty implications require careful framework design (High)',
        'Multiple stakeholders with varying data classification requirements (Medium)',
        'Compliance with federal and local regulations (Medium)',
        'Technical integration complexity (Medium)',
      ],
      reasoning: 'Elevated risk due to data sovereignty considerations. Recommend phased implementation with compliance checkpoints.',
      confidence: 82,
    },
  },
  {
    id: 'audit-011',
    decisionId: 'dec-002',
    timestamp: '2026-01-10T09:05:00Z',
    action: 'decision_escalated',
    actor: 'ai',
    actorId: 'agent-routing',
    details: {
      reasoning: 'Escalated from Level 2 to Level 3 due to cross-entity policy implications and data sovereignty considerations',
      previousValue: 2,
      newValue: 3,
    },
  },
  {
    id: 'audit-012',
    decisionId: 'dec-002',
    timestamp: '2026-01-10T09:06:00Z',
    action: 'recommendation_generated',
    actor: 'ai',
    actorId: 'agent-decision',
    details: {
      reasoning: 'RECOMMEND APPROVAL with conditions: 1) Phased rollout starting with non-sensitive data, 2) Quarterly compliance audits, 3) Data Protection Officer oversight. Framework aligns with federal mandates and enables digital transformation goals.',
      confidence: 82,
      newValue: 'approve',
    },
  },
  // AI Training Data Procurement (Completed Decision)
  {
    id: 'audit-013',
    decisionId: 'dec-003',
    timestamp: '2026-01-05T10:00:00Z',
    action: 'decision_created',
    actor: 'human',
    actorId: 'stake-4',
    actorName: 'Fatima Al Zaabi',
    details: {
      reasoning: 'Procurement request for AI training datasets',
    },
  },
  {
    id: 'audit-014',
    decisionId: 'dec-003',
    timestamp: '2026-01-05T10:01:30Z',
    action: 'context_retrieved',
    actor: 'ai',
    actorId: 'agent-context',
    details: {
      contextRetrieved: [
        'AI Governance Framework v1.5',
        'Procurement Authority Matrix v3.0',
        'Vendor evaluation criteria for AI services',
      ],
      confidence: 96,
    },
  },
  {
    id: 'audit-015',
    decisionId: 'dec-003',
    timestamp: '2026-01-05T10:02:00Z',
    action: 'recommendation_generated',
    actor: 'ai',
    actorId: 'agent-decision',
    details: {
      reasoning: 'RECOMMEND APPROVAL: Standard procurement within Level 2 threshold. Vendor has prior government contracts. Dataset quality verified.',
      confidence: 94,
      newValue: 'approve',
    },
  },
  {
    id: 'audit-016',
    decisionId: 'dec-003',
    timestamp: '2026-01-08T11:00:00Z',
    action: 'human_review_started',
    actor: 'human',
    actorId: 'stake-5',
    actorName: 'Omar Hassan',
    details: {
      reasoning: 'CFO review of procurement value and budget alignment',
    },
  },
  {
    id: 'audit-017',
    decisionId: 'dec-003',
    timestamp: '2026-01-15T12:00:00Z',
    action: 'decision_approved',
    actor: 'human',
    actorId: 'stake-5',
    actorName: 'Omar Hassan',
    details: {
      reasoning: 'Approved. Budget allocation confirmed. Proceeding with vendor onboarding.',
    },
  },
  {
    id: 'audit-018',
    decisionId: 'dec-003',
    timestamp: '2026-01-15T12:05:00Z',
    action: 'feedback_submitted',
    actor: 'human',
    actorId: 'stake-5',
    actorName: 'Omar Hassan',
    details: {
      reasoning: 'AI recommendation was accurate. Risk assessment aligned with finance review.',
    },
    metadata: {
      feedbackRating: 'good',
      feedbackId: 'fb-008',
    },
  },
];

// Helper functions
export const getAuditByDecision = (decisionId: string): AuditEntry[] => 
  auditEntries.filter(a => a.decisionId === decisionId).sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

export const getAuditByAction = (action: AuditEntry['action']): AuditEntry[] => 
  auditEntries.filter(a => a.action === action);

export const getAuditByActor = (actorType: 'ai' | 'human'): AuditEntry[] => 
  auditEntries.filter(a => a.actor === actorType);

export const getRecentAuditEntries = (limit: number = 20): AuditEntry[] => 
  [...auditEntries]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, limit);
