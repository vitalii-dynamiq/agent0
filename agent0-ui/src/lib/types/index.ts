// Decision Types
export type DecisionLevel = 1 | 2 | 3;
export type DecisionStatus = 
  | 'incoming' 
  | 'classifying' 
  | 'in_analysis' 
  | 'awaiting_review' 
  | 'with_chairman' 
  | 'in_execution' 
  | 'completed' 
  | 'rejected';

export type DecisionCategory = 
  | 'procurement' 
  | 'budget' 
  | 'policy' 
  | 'hr' 
  | 'partnership' 
  | 'infrastructure' 
  | 'strategic';

export type CeoPillar =
  | 'priority_setting'
  | 'operational_alignment'
  | 'team_talent'
  | 'board_engagement'
  | 'communications'
  | 'personal_effectiveness';

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export interface Decision {
  id: string;
  title: string;
  description: string;
  category: DecisionCategory;
  level: DecisionLevel;
  status: DecisionStatus;
  isPrecedent?: boolean;
  ceoPillar: CeoPillar;
  requesterId: string;
  departmentId: string;
  value?: number; // in AED
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  
  // AI Analysis
  aiRecommendation?: 'approve' | 'reject' | 'defer' | 'escalate';
  aiConfidence?: number; // 0-100
  aiReasoning?: string;
  riskAssessment?: RiskAssessment;
  precedents?: Precedent[];
  stakeholderImpact?: StakeholderImpact[];
  
  // For escalated decisions
  escalatedFrom?: DecisionLevel;
  escalationReason?: string;
  
  // Workflow tracking
  workflowSteps?: WorkflowStep[];

  // Authority barometer + ADEO evaluation
  authorityBarometer?: AuthorityBarometerOutput;
  adeoFlow?: AdeoFlowStep[];

  // Execution tracking + outcome observability
  route?: DecisionRouteStep[];
  triage?: DecisionTriage;
  execution?: DecisionExecution;
  outcome?: DecisionOutcome;
}

export interface RiskAssessment {
  overall: RiskLevel;
  financial: RiskLevel;
  operational: RiskLevel;
  reputational: RiskLevel;
  factors: string[];
}

export interface Precedent {
  id: string;
  title: string;
  outcome: 'approved' | 'rejected' | 'deferred';
  date: string;
  similarity: number; // 0-100
  precedentDecisionId?: string;
}

export interface StakeholderImpact {
  stakeholderId: string;
  impact: 'positive' | 'neutral' | 'negative';
  notes?: string;
}

export interface WorkflowStep {
  id: string;
  name: string;
  status: 'pending' | 'active' | 'completed' | 'skipped';
  completedAt?: string;
  actor?: string;
  notes?: string;
}

export type DecisionRouteStatus = 'pending' | 'active' | 'completed';

export interface DecisionRouteStep {
  id: string;
  label: string;
  status: DecisionRouteStatus;
  timestamp?: string;
}

export interface DecisionTriage {
  priority: 'low' | 'medium' | 'high';
  queuePosition: number;
  slaTargetHours: number;
  slaStatus: 'on_track' | 'at_risk' | 'breached';
}

export interface DecisionExecutionMilestone {
  id: string;
  title: string;
  status: 'pending' | 'active' | 'completed';
  eta?: string;
}

export interface DecisionExecution {
  progress: number; // 0-100
  owner: string;
  milestones: DecisionExecutionMilestone[];
}

export interface DecisionOutcome {
  status: 'on_track' | 'at_risk' | 'achieved' | 'missed';
  impactSummary: string;
  learningSignal: string;
}

export interface AuthorityBarometerOutput {
  tier: DecisionLevel;
  status: 'auto' | 'review' | 'chairman';
  confidence: number; // 0-100
  lastUpdated: string;
  drivers: string[];
}

export interface AdeoFlowStep {
  id: string;
  label: string;
  status: 'pending' | 'in_progress' | 'completed';
  notes?: string;
}

// Stakeholder Types
export type StakeholderType = 'internal' | 'external' | 'government';

export interface Stakeholder {
  id: string;
  name: string;
  title: string;
  organization: string;
  type: StakeholderType;
  email: string;
  phone?: string;
  avatar?: string;
  
  // Relationship tracking
  relationshipScore: number; // 0-100
  lastInteraction?: string;
  openItems: number;
  pendingDecisions: number;
  
  // Communication history summary
  totalMeetings: number;
  totalEmails: number;
  
  // Known positions on key topics
  positions?: StakeholderPosition[];
}

export interface StakeholderPosition {
  topic: string;
  stance: 'supportive' | 'neutral' | 'opposed' | 'unknown';
  notes?: string;
}

// Department Types
export interface Department {
  id: string;
  name: string;
  shortName: string;
  headId: string;
  parentId?: string;
  budget?: number;
  employeeCount: number;
}

// Meeting Types
export interface Meeting {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: number; // minutes
  attendees: MeetingAttendee[];
  location?: string;
  type: 'internal' | 'external' | 'board' | 'one_on_one';
  
  // AI-generated briefing
  briefing?: MeetingBriefing;
  
  // Post-meeting
  actionItems?: ActionItem[];
  notes?: string;

  // Meeting intelligence
  recording?: MeetingRecording;
  transcriptSummary?: string;
  transcript?: MeetingTranscriptEntry[];
}

export interface MeetingAttendee {
  stakeholderId: string;
  role: 'host' | 'required' | 'optional';
  confirmed: boolean;
}

export interface MeetingBriefing {
  objectives: string[];
  talkingPoints: string[];
  openCommitments: string[];
  recentInteractions: string[];
  suggestedQuestions: string[];
  relevantDecisions: string[];
}

export interface MeetingRecording {
  status: 'available' | 'processing' | 'missing';
  url?: string;
  duration?: number; // minutes
  provider?: string;
}

export interface MeetingTranscriptEntry {
  id: string;
  speaker: string;
  timestamp: string;
  text: string;
}

export interface ActionItem {
  id: string;
  description: string;
  assigneeId: string;
  dueDate: string;
  status: 'pending' | 'in_progress' | 'completed';
}

// Analytics Types
export interface AnalyticsMetric {
  label: string;
  value: number;
  change?: number; // percentage change from previous period
  trend?: 'up' | 'down' | 'stable';
}

export interface DecisionAnalytics {
  totalDecisions: number;
  byLevel: { level: DecisionLevel; count: number }[];
  byCategory: { category: DecisionCategory; count: number }[];
  byStatus: { status: DecisionStatus; count: number }[];
  averageCycleTime: number; // in hours
  throughputTrend: { date: string; count: number }[];
}

// Workflow Builder Types
export type WorkflowNodeType = 
  | 'intake' 
  | 'classifier' 
  | 'context' 
  | 'analysis' 
  | 'human_review' 
  | 'execution'
  | 'notification';

export interface WorkflowNode {
  id: string;
  type: WorkflowNodeType;
  label: string;
  config: Record<string, unknown>;
  position: { x: number; y: number };
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  condition?: string;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Knowledge Base Types
export interface DataSource {
  id: string;
  name: string;
  type: 'oracle_fusion' | 'ecas' | 'sharepoint' | 'email' | 'calendar' | 'custom' | 'tamm';
  status: 'connected' | 'syncing' | 'error' | 'disconnected';
  lastSync?: string;
  documentsCount: number;
  entitiesCount: number;
}

export interface KnowledgeEntity {
  id: string;
  type: 'person' | 'department' | 'decision' | 'policy' | 'project' | 'document';
  name: string;
  properties: Record<string, unknown>;
  connections: number;
}

// Activity Log Types
export interface ActivityLogEntry {
  id: string;
  timestamp: string;
  type: 'classification' | 'analysis' | 'recommendation' | 'escalation' | 'execution' | 'override';
  decisionId?: string;
  description: string;
  details?: Record<string, unknown>;
  confidence?: number;
}

// User/Persona Types
export type PersonaType = 'chairman' | 'chief_of_staff' | 'head_of_ai';

export interface User {
  id: string;
  name: string;
  title: string;
  persona: PersonaType;
  avatar?: string;
}

// AI Assistant Types
export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isVoice?: boolean;
  widget?: 'overview' | 'decisions' | 'meetings' | 'news' | 'signals' | 'approval' | 'email' | 'calendar' | 'draft';
  meta?: Record<string, unknown>;
}

export interface BriefingCard {
  id: string;
  type: 'decisions' | 'meeting' | 'initiative' | 'alert' | 'insight';
  title: string;
  subtitle: string;
  value?: string | number;
  action?: string;
  priority: 'high' | 'medium' | 'low';
  link?: string;
}

// Authority Configuration Types
export interface AuthorityThreshold {
  level: DecisionLevel;
  conditions: AuthorityCondition[];
}

export interface AuthorityCondition {
  field: string;
  operator: 'lt' | 'lte' | 'gt' | 'gte' | 'eq' | 'contains';
  value: string | number;
}

export interface AuthorityBarometerConfig {
  volatilitySensitivity: number; // 0-100
  stakeholderImpactWeight: number; // 0-100
  precedentConfidenceThreshold: number; // 0-100
  autoEscalateOnCrisis: boolean;
}

// Knowledge Graph Types
export type KnowledgeNodeType = 'person' | 'department' | 'decision' | 'policy' | 'project' | 'document';

export interface KnowledgeGraphNode {
  id: string;
  type: KnowledgeNodeType;
  label: string;
  description?: string;
  properties: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface KnowledgeGraphEdge {
  id: string;
  source: string;
  target: string;
  relationship: 'authored' | 'approved' | 'references' | 'belongs_to' | 'related_to' | 'manages' | 'created' | 'impacts';
  weight?: number;
  createdAt: string;
}

export interface KnowledgeGraphData {
  nodes: KnowledgeGraphNode[];
  edges: KnowledgeGraphEdge[];
}

// AI Agent Types
export type AgentType = 'decision' | 'briefing' | 'analysis' | 'context' | 'persona' | 'routing';
export type AgentStatus = 'active' | 'inactive' | 'training' | 'error';

export interface AIAgent {
  id: string;
  name: string;
  description: string;
  type: AgentType;
  status: AgentStatus;
  model: string;
  version: string;
  accuracy: number; // 0-100
  totalDecisions: number;
  avgResponseTime: number; // ms
  lastUpdated: string;
  config: {
    temperature: number;
    maxTokens: number;
    confidenceThreshold: number;
    knowledgeSources: string[];
    promptTemplate?: string;
  };
}

// RLHF Types
export type FeedbackRating = 'excellent' | 'good' | 'needs_improvement' | 'incorrect';

export interface RLHFFeedback {
  id: string;
  decisionId: string;
  agentId: string;
  rating: FeedbackRating;
  feedback: string;
  originalRecommendation: string;
  correctedRecommendation?: string;
  submittedBy: string;
  timestamp: string;
  incorporated: boolean;
}

export interface RLHFStats {
  totalFeedback: number;
  incorporated: number;
  pending: number;
  averageRating: number;
  improvementTrend: number; // percentage
}

// Policy Types
export type PolicyStatus = 'draft' | 'active' | 'archived' | 'under_review';
export type PolicyCategory = 'governance' | 'financial' | 'operational' | 'hr' | 'security' | 'compliance';

export interface PolicyRule {
  id: string;
  condition: string;
  action: string;
  priority: number;
}

export interface Policy {
  id: string;
  name: string;
  description: string;
  category: PolicyCategory;
  status: PolicyStatus;
  rules: PolicyRule[];
  applicableDepartments: string[];
  applicableDecisionTypes: DecisionCategory[];
  effectiveDate: string;
  expiryDate?: string;
  version: number;
  parentPolicyId?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// Audit Trail Types
export type AuditAction = 
  | 'decision_created'
  | 'context_retrieved'
  | 'precedents_matched'
  | 'risk_assessed'
  | 'recommendation_generated'
  | 'human_review_started'
  | 'decision_approved'
  | 'decision_rejected'
  | 'decision_escalated'
  | 'feedback_submitted'
  | 'policy_applied';

export interface AuditEntry {
  id: string;
  decisionId: string;
  timestamp: string;
  action: AuditAction;
  actor: 'ai' | 'human';
  actorId?: string;
  actorName?: string;
  details: {
    contextRetrieved?: string[];
    precedentsMatched?: { id: string; title: string; similarity: number }[];
    riskFactors?: string[];
    reasoning?: string;
    confidence?: number;
    policyApplied?: string;
    previousValue?: unknown;
    newValue?: unknown;
  };
  metadata?: Record<string, unknown>;
}

// Digital Persona Types
export interface PersonaSettings {
  id: string;
  userId: string;
  communicationStyle: 'formal' | 'conversational' | 'concise';
  verbosity: number; // 1-5
  technicalDepth: number; // 1-5
  preferredLanguage: string;
  voiceSettings: {
    enabled: boolean;
    voiceId: string;
    speed: number;
    pitch: number;
  };
  avatarSettings: {
    style: 'professional' | 'friendly' | 'minimal';
    primaryColor: string;
  };
  topicPriorities: string[];
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
  categoryPreferences: Record<DecisionCategory, 'auto_approve' | 'review' | 'always_escalate'>;
  updatedAt: string;
}

// Strategic Initiative Types
export type InitiativeStatus = 'planning' | 'in_progress' | 'on_hold' | 'completed' | 'cancelled';
export type InitiativePriority = 'critical' | 'high' | 'medium' | 'low';

export interface Initiative {
  id: string;
  name: string;
  description: string;
  status: InitiativeStatus;
  priority: InitiativePriority;
  progress: number; // 0-100
  startDate: string;
  targetDate: string;
  budget?: number;
  spentBudget?: number;
  owner: string;
  relatedDecisions: string[];
  milestones: InitiativeMilestone[];
  createdAt: string;
  updatedAt: string;
}

export interface InitiativeMilestone {
  id: string;
  name: string;
  dueDate: string;
  status: 'pending' | 'completed' | 'overdue';
  completedDate?: string;
}
