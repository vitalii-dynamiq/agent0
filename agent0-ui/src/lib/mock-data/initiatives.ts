import { Initiative, PersonaSettings } from '../types';

export const initiatives: Initiative[] = [
  {
    id: 'init-001',
    name: 'TAMM 5.0 Platform Development',
    description: 'Next generation unified government services platform with AI-powered recommendations and predictive citizen needs',
    status: 'in_progress',
    priority: 'critical',
    progress: 35,
    startDate: '2026-02-01',
    targetDate: '2027-06-30',
    budget: 42000000,
    spentBudget: 8400000,
    owner: 'Ahmed Al Mansoori',
    relatedDecisions: ['dec-001'],
    milestones: [
      { id: 'm-001-1', name: 'Requirements Finalization', dueDate: '2026-02-28', status: 'completed', completedDate: '2026-02-25' },
      { id: 'm-001-2', name: 'Architecture Design', dueDate: '2026-04-15', status: 'pending' },
      { id: 'm-001-3', name: 'Phase 1 Development', dueDate: '2026-08-31', status: 'pending' },
      { id: 'm-001-4', name: 'UAT & Security Audit', dueDate: '2026-11-30', status: 'pending' },
      { id: 'm-001-5', name: 'Pilot Launch', dueDate: '2027-02-28', status: 'pending' },
      { id: 'm-001-6', name: 'Full Rollout', dueDate: '2027-06-30', status: 'pending' },
    ],
    createdAt: '2025-10-01T00:00:00Z',
    updatedAt: '2026-01-19T00:00:00Z',
  },
  {
    id: 'init-002',
    name: 'Agent-0 Deployment',
    description: 'AI-powered executive decision support system for leadership augmentation',
    status: 'in_progress',
    priority: 'high',
    progress: 65,
    startDate: '2025-06-01',
    targetDate: '2026-03-31',
    budget: 15000000,
    spentBudget: 11250000,
    owner: 'Fatima Al Zaabi',
    relatedDecisions: ['dec-002', 'dec-003'],
    milestones: [
      { id: 'm-002-1', name: 'Platform Setup', dueDate: '2025-08-15', status: 'completed', completedDate: '2025-08-10' },
      { id: 'm-002-2', name: 'Knowledge Graph Integration', dueDate: '2025-10-31', status: 'completed', completedDate: '2025-11-05' },
      { id: 'm-002-3', name: 'Decision Engine Training', dueDate: '2025-12-31', status: 'completed', completedDate: '2025-12-28' },
      { id: 'm-002-4', name: 'Chairman Interface Launch', dueDate: '2026-02-15', status: 'pending' },
      { id: 'm-002-5', name: 'Full Production Rollout', dueDate: '2026-03-31', status: 'pending' },
    ],
    createdAt: '2025-06-01T00:00:00Z',
    updatedAt: '2026-01-19T00:00:00Z',
  },
  {
    id: 'init-003',
    name: 'Government Data Lake',
    description: 'Centralized data repository enabling cross-entity analytics and AI model training',
    status: 'planning',
    priority: 'high',
    progress: 15,
    startDate: '2026-04-01',
    targetDate: '2027-12-31',
    budget: 28000000,
    spentBudget: 1400000,
    owner: 'Dr. Sarah Al Rashid',
    relatedDecisions: ['dec-002'],
    milestones: [
      { id: 'm-003-1', name: 'Requirements & Architecture', dueDate: '2026-05-31', status: 'pending' },
      { id: 'm-003-2', name: 'Infrastructure Procurement', dueDate: '2026-08-31', status: 'pending' },
      { id: 'm-003-3', name: 'Phase 1 - Core Platform', dueDate: '2027-02-28', status: 'pending' },
      { id: 'm-003-4', name: 'Data Migration Wave 1', dueDate: '2027-06-30', status: 'pending' },
      { id: 'm-003-5', name: 'Full Integration', dueDate: '2027-12-31', status: 'pending' },
    ],
    createdAt: '2025-12-01T00:00:00Z',
    updatedAt: '2026-01-15T00:00:00Z',
  },
  {
    id: 'init-004',
    name: 'Digital Identity Enhancement',
    description: 'Unified digital identity system with biometric authentication and cross-service recognition',
    status: 'in_progress',
    priority: 'medium',
    progress: 48,
    startDate: '2025-09-01',
    targetDate: '2026-08-31',
    budget: 12000000,
    spentBudget: 5760000,
    owner: 'Ahmed Al Mansoori',
    relatedDecisions: [],
    milestones: [
      { id: 'm-004-1', name: 'Biometric Integration', dueDate: '2025-12-15', status: 'completed', completedDate: '2025-12-18' },
      { id: 'm-004-2', name: 'UAE Pass Enhancement', dueDate: '2026-03-31', status: 'pending' },
      { id: 'm-004-3', name: 'Service Integration', dueDate: '2026-06-30', status: 'pending' },
      { id: 'm-004-4', name: 'Public Launch', dueDate: '2026-08-31', status: 'pending' },
    ],
    createdAt: '2025-09-01T00:00:00Z',
    updatedAt: '2026-01-10T00:00:00Z',
  },
  {
    id: 'init-005',
    name: 'Smart Government Analytics',
    description: 'Real-time analytics dashboard for government service performance and citizen satisfaction',
    status: 'completed',
    priority: 'medium',
    progress: 100,
    startDate: '2025-03-01',
    targetDate: '2025-12-31',
    budget: 5500000,
    spentBudget: 5200000,
    owner: 'Fatima Al Zaabi',
    relatedDecisions: [],
    milestones: [
      { id: 'm-005-1', name: 'Dashboard Design', dueDate: '2025-05-15', status: 'completed', completedDate: '2025-05-12' },
      { id: 'm-005-2', name: 'Data Pipeline Setup', dueDate: '2025-07-31', status: 'completed', completedDate: '2025-07-28' },
      { id: 'm-005-3', name: 'Beta Launch', dueDate: '2025-10-15', status: 'completed', completedDate: '2025-10-10' },
      { id: 'm-005-4', name: 'Full Deployment', dueDate: '2025-12-31', status: 'completed', completedDate: '2025-12-20' },
    ],
    createdAt: '2025-03-01T00:00:00Z',
    updatedAt: '2025-12-20T00:00:00Z',
  },
  {
    id: 'init-006',
    name: 'Cybersecurity Enhancement Program',
    description: 'Comprehensive security upgrade including SOC establishment and threat intelligence integration',
    status: 'in_progress',
    priority: 'critical',
    progress: 72,
    startDate: '2025-04-01',
    targetDate: '2026-06-30',
    budget: 18000000,
    spentBudget: 14400000,
    owner: 'Dr. Sarah Al Rashid',
    relatedDecisions: [],
    milestones: [
      { id: 'm-006-1', name: 'SOC Setup', dueDate: '2025-08-31', status: 'completed', completedDate: '2025-08-25' },
      { id: 'm-006-2', name: 'SIEM Integration', dueDate: '2025-11-30', status: 'completed', completedDate: '2025-12-02' },
      { id: 'm-006-3', name: 'Threat Intelligence', dueDate: '2026-02-28', status: 'pending' },
      { id: 'm-006-4', name: 'Zero Trust Implementation', dueDate: '2026-06-30', status: 'pending' },
    ],
    createdAt: '2025-04-01T00:00:00Z',
    updatedAt: '2026-01-18T00:00:00Z',
  },
];

export const defaultPersonaSettings: PersonaSettings = {
  id: 'persona-chairman',
  userId: 'user-chairman',
  communicationStyle: 'formal',
  verbosity: 3,
  technicalDepth: 2,
  preferredLanguage: 'en',
  voiceSettings: {
    enabled: true,
    voiceId: 'onyx',
    speed: 1.0,
    pitch: 1.0,
  },
  avatarSettings: {
    style: 'professional',
    primaryColor: '#0D9488',
  },
  topicPriorities: [
    'Digital Transformation',
    'Strategic Partnerships',
    'Budget & Finance',
    'Citizen Services',
    'AI & Innovation',
  ],
  riskTolerance: 'moderate',
  categoryPreferences: {
    procurement: 'review',
    budget: 'review',
    policy: 'always_escalate',
    hr: 'review',
    partnership: 'always_escalate',
    infrastructure: 'review',
    strategic: 'always_escalate',
  },
  updatedAt: '2026-01-15T00:00:00Z',
};

// Helper functions
export const getInitiativeById = (id: string): Initiative | undefined => 
  initiatives.find(i => i.id === id);

export const getInitiativesByStatus = (status: Initiative['status']): Initiative[] => 
  initiatives.filter(i => i.status === status);

export const getInitiativesByPriority = (priority: Initiative['priority']): Initiative[] => 
  initiatives.filter(i => i.priority === priority);

export const getActiveInitiatives = (): Initiative[] => 
  initiatives.filter(i => i.status === 'in_progress' || i.status === 'planning');

export const getInitiativesForDecision = (decisionId: string): Initiative[] => 
  initiatives.filter(i => i.relatedDecisions.includes(decisionId));
