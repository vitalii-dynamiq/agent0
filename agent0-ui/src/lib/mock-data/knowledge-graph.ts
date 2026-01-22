import { KnowledgeGraphNode, KnowledgeGraphEdge, KnowledgeGraphData } from '../types';

export const knowledgeNodes: KnowledgeGraphNode[] = [
  // People
  {
    id: 'node-person-1',
    type: 'person',
    label: 'H.E. Mohammed Al Gergawi',
    description: 'Chairman of DGE',
    properties: {
      title: 'Chairman',
      department: 'Executive Office',
      email: 'chairman@dge.gov.ae',
      decisionAuthority: 'Level 3',
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2026-01-19T00:00:00Z',
  },
  {
    id: 'node-person-2',
    type: 'person',
    label: 'Dr. Sarah Al Rashid',
    description: 'Undersecretary of Digital Transformation',
    properties: {
      title: 'Undersecretary',
      department: 'Digital Transformation',
      email: 'sarah.rashid@dge.gov.ae',
      decisionAuthority: 'Level 2',
    },
    createdAt: '2024-03-15T00:00:00Z',
    updatedAt: '2026-01-15T00:00:00Z',
  },
  {
    id: 'node-person-3',
    type: 'person',
    label: 'Ahmed Al Mansoori',
    description: 'Director of TAMM',
    properties: {
      title: 'Director',
      department: 'TAMM Services',
      email: 'ahmed.mansoori@dge.gov.ae',
      decisionAuthority: 'Level 2',
    },
    createdAt: '2024-06-01T00:00:00Z',
    updatedAt: '2026-01-10T00:00:00Z',
  },
  {
    id: 'node-person-4',
    type: 'person',
    label: 'Fatima Al Zaabi',
    description: 'Head of AI & Analytics',
    properties: {
      title: 'Head of AI',
      department: 'Technology',
      email: 'fatima.zaabi@dge.gov.ae',
      decisionAuthority: 'Level 2',
    },
    createdAt: '2024-09-01T00:00:00Z',
    updatedAt: '2026-01-18T00:00:00Z',
  },
  {
    id: 'node-person-5',
    type: 'person',
    label: 'Omar Hassan',
    description: 'CFO',
    properties: {
      title: 'Chief Financial Officer',
      department: 'Finance',
      email: 'omar.hassan@dge.gov.ae',
      decisionAuthority: 'Level 2',
    },
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2026-01-12T00:00:00Z',
  },
  // Departments
  {
    id: 'node-dept-1',
    type: 'department',
    label: 'Executive Office',
    description: 'Chairman\'s Office and Strategic Planning',
    properties: {
      headCount: 25,
      budget: 50000000,
      location: 'Abu Dhabi HQ',
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'node-dept-2',
    type: 'department',
    label: 'Digital Transformation',
    description: 'Government Digital Services',
    properties: {
      headCount: 120,
      budget: 180000000,
      location: 'Abu Dhabi HQ',
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'node-dept-3',
    type: 'department',
    label: 'TAMM Services',
    description: 'Unified Government Services Platform',
    properties: {
      headCount: 85,
      budget: 95000000,
      location: 'Abu Dhabi HQ',
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'node-dept-4',
    type: 'department',
    label: 'Technology & AI',
    description: 'AI, Data Science, and Infrastructure',
    properties: {
      headCount: 65,
      budget: 120000000,
      location: 'Abu Dhabi HQ',
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  // Decisions
  {
    id: 'node-dec-1',
    type: 'decision',
    label: 'TAMM 5.0 Platform Approval',
    description: 'Phase 2 development of unified government services platform',
    properties: {
      level: 3,
      status: 'with_chairman',
      value: 42000000,
      category: 'strategic',
      aiRecommendation: 'approve',
      confidence: 89,
    },
    createdAt: '2026-01-08T08:00:00Z',
    updatedAt: '2026-01-19T06:00:00Z',
  },
  {
    id: 'node-dec-2',
    type: 'decision',
    label: 'Cross-Entity Data Sharing Framework',
    description: 'Unified data governance framework for inter-departmental sharing',
    properties: {
      level: 3,
      status: 'with_chairman',
      value: 8500000,
      category: 'policy',
      aiRecommendation: 'approve',
      confidence: 82,
    },
    createdAt: '2026-01-10T09:00:00Z',
    updatedAt: '2026-01-19T04:00:00Z',
  },
  {
    id: 'node-dec-3',
    type: 'decision',
    label: 'AI Training Data Procurement',
    description: 'Licensed datasets for model training',
    properties: {
      level: 2,
      status: 'completed',
      value: 2500000,
      category: 'procurement',
      aiRecommendation: 'approve',
      confidence: 94,
    },
    createdAt: '2026-01-05T10:00:00Z',
    updatedAt: '2026-01-15T12:00:00Z',
  },
  // Policies
  {
    id: 'node-policy-1',
    type: 'policy',
    label: 'Data Sovereignty Policy',
    description: 'Guidelines for data storage and processing within UAE borders',
    properties: {
      status: 'active',
      version: 2.1,
      category: 'compliance',
      effectiveDate: '2025-06-01',
    },
    createdAt: '2025-05-01T00:00:00Z',
    updatedAt: '2025-12-15T00:00:00Z',
  },
  {
    id: 'node-policy-2',
    type: 'policy',
    label: 'AI Governance Framework',
    description: 'Ethical AI usage and decision transparency requirements',
    properties: {
      status: 'active',
      version: 1.5,
      category: 'governance',
      effectiveDate: '2025-09-01',
    },
    createdAt: '2025-08-01T00:00:00Z',
    updatedAt: '2026-01-10T00:00:00Z',
  },
  {
    id: 'node-policy-3',
    type: 'policy',
    label: 'Procurement Authority Matrix',
    description: 'Decision authority levels for procurement activities',
    properties: {
      status: 'active',
      version: 3.0,
      category: 'financial',
      effectiveDate: '2025-01-01',
    },
    createdAt: '2024-11-01T00:00:00Z',
    updatedAt: '2025-12-01T00:00:00Z',
  },
  // Projects
  {
    id: 'node-project-1',
    type: 'project',
    label: 'TAMM 5.0',
    description: 'Next generation unified government services platform',
    properties: {
      status: 'in_progress',
      progress: 35,
      budget: 42000000,
      startDate: '2026-02-01',
      targetDate: '2027-06-30',
    },
    createdAt: '2025-10-01T00:00:00Z',
    updatedAt: '2026-01-19T00:00:00Z',
  },
  {
    id: 'node-project-2',
    type: 'project',
    label: 'Agent-0 Deployment',
    description: 'AI-powered executive decision support system',
    properties: {
      status: 'in_progress',
      progress: 65,
      budget: 15000000,
      startDate: '2025-06-01',
      targetDate: '2026-03-31',
    },
    createdAt: '2025-06-01T00:00:00Z',
    updatedAt: '2026-01-19T00:00:00Z',
  },
  {
    id: 'node-project-3',
    type: 'project',
    label: 'Data Lake Initiative',
    description: 'Centralized government data repository',
    properties: {
      status: 'planning',
      progress: 15,
      budget: 28000000,
      startDate: '2026-04-01',
      targetDate: '2027-12-31',
    },
    createdAt: '2025-12-01T00:00:00Z',
    updatedAt: '2026-01-15T00:00:00Z',
  },
  // Documents
  {
    id: 'node-doc-1',
    type: 'document',
    label: 'Abu Dhabi Digital Strategy 2025-2030',
    description: 'Strategic roadmap for digital government transformation',
    properties: {
      source: 'sharepoint',
      fileType: 'pdf',
      pages: 85,
      classification: 'official',
    },
    createdAt: '2024-12-01T00:00:00Z',
    updatedAt: '2025-06-01T00:00:00Z',
  },
  {
    id: 'node-doc-2',
    type: 'document',
    label: 'TAMM Phase 1 Post-Implementation Review',
    description: 'Assessment of TAMM platform initial deployment',
    properties: {
      source: 'sharepoint',
      fileType: 'docx',
      pages: 42,
      classification: 'internal',
    },
    createdAt: '2025-03-15T00:00:00Z',
    updatedAt: '2025-03-15T00:00:00Z',
  },
  {
    id: 'node-doc-3',
    type: 'document',
    label: 'FY2026 Budget Proposal',
    description: 'Annual budget allocation request',
    properties: {
      source: 'oracle_fusion',
      fileType: 'xlsx',
      pages: 28,
      classification: 'confidential',
    },
    createdAt: '2025-10-01T00:00:00Z',
    updatedAt: '2025-11-30T00:00:00Z',
  },
];

export const knowledgeEdges: KnowledgeGraphEdge[] = [
  // Person -> Department relationships
  { id: 'edge-1', source: 'node-person-1', target: 'node-dept-1', relationship: 'manages', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'edge-2', source: 'node-person-2', target: 'node-dept-2', relationship: 'manages', createdAt: '2024-03-15T00:00:00Z' },
  { id: 'edge-3', source: 'node-person-3', target: 'node-dept-3', relationship: 'manages', createdAt: '2024-06-01T00:00:00Z' },
  { id: 'edge-4', source: 'node-person-4', target: 'node-dept-4', relationship: 'manages', createdAt: '2024-09-01T00:00:00Z' },
  
  // Decision -> Person relationships (who approved/created)
  { id: 'edge-5', source: 'node-person-3', target: 'node-dec-1', relationship: 'created', createdAt: '2026-01-08T08:00:00Z' },
  { id: 'edge-6', source: 'node-person-2', target: 'node-dec-2', relationship: 'created', createdAt: '2026-01-10T09:00:00Z' },
  { id: 'edge-7', source: 'node-person-4', target: 'node-dec-3', relationship: 'created', createdAt: '2026-01-05T10:00:00Z' },
  { id: 'edge-8', source: 'node-person-5', target: 'node-dec-3', relationship: 'approved', createdAt: '2026-01-15T12:00:00Z' },
  
  // Decision -> Policy relationships
  { id: 'edge-9', source: 'node-dec-2', target: 'node-policy-1', relationship: 'references', createdAt: '2026-01-10T09:00:00Z' },
  { id: 'edge-10', source: 'node-dec-1', target: 'node-policy-2', relationship: 'references', createdAt: '2026-01-08T08:00:00Z' },
  { id: 'edge-11', source: 'node-dec-3', target: 'node-policy-3', relationship: 'references', createdAt: '2026-01-05T10:00:00Z' },
  
  // Decision -> Project relationships
  { id: 'edge-12', source: 'node-dec-1', target: 'node-project-1', relationship: 'impacts', createdAt: '2026-01-08T08:00:00Z' },
  { id: 'edge-13', source: 'node-dec-2', target: 'node-project-2', relationship: 'impacts', createdAt: '2026-01-10T09:00:00Z' },
  { id: 'edge-14', source: 'node-dec-2', target: 'node-project-3', relationship: 'impacts', createdAt: '2026-01-10T09:00:00Z' },
  
  // Project -> Department relationships
  { id: 'edge-15', source: 'node-project-1', target: 'node-dept-3', relationship: 'belongs_to', createdAt: '2025-10-01T00:00:00Z' },
  { id: 'edge-16', source: 'node-project-2', target: 'node-dept-4', relationship: 'belongs_to', createdAt: '2025-06-01T00:00:00Z' },
  { id: 'edge-17', source: 'node-project-3', target: 'node-dept-2', relationship: 'belongs_to', createdAt: '2025-12-01T00:00:00Z' },
  
  // Document -> Decision/Project relationships
  { id: 'edge-18', source: 'node-doc-1', target: 'node-dec-1', relationship: 'references', createdAt: '2026-01-08T08:00:00Z' },
  { id: 'edge-19', source: 'node-doc-2', target: 'node-project-1', relationship: 'references', createdAt: '2025-10-01T00:00:00Z' },
  { id: 'edge-20', source: 'node-doc-3', target: 'node-dec-1', relationship: 'references', createdAt: '2026-01-08T08:00:00Z' },
  
  // Policy -> Department applicability
  { id: 'edge-21', source: 'node-policy-1', target: 'node-dept-2', relationship: 'impacts', createdAt: '2025-06-01T00:00:00Z' },
  { id: 'edge-22', source: 'node-policy-1', target: 'node-dept-4', relationship: 'impacts', createdAt: '2025-06-01T00:00:00Z' },
  { id: 'edge-23', source: 'node-policy-2', target: 'node-dept-4', relationship: 'impacts', createdAt: '2025-09-01T00:00:00Z' },
  
  // Person -> Person relationships
  { id: 'edge-24', source: 'node-person-2', target: 'node-person-1', relationship: 'related_to', weight: 85, createdAt: '2024-03-15T00:00:00Z' },
  { id: 'edge-25', source: 'node-person-3', target: 'node-person-2', relationship: 'related_to', weight: 75, createdAt: '2024-06-01T00:00:00Z' },
  { id: 'edge-26', source: 'node-person-4', target: 'node-person-2', relationship: 'related_to', weight: 80, createdAt: '2024-09-01T00:00:00Z' },
];

export const knowledgeGraph: KnowledgeGraphData = {
  nodes: knowledgeNodes,
  edges: knowledgeEdges,
};

// Helper functions
export const getNodeById = (id: string): KnowledgeGraphNode | undefined => 
  knowledgeNodes.find(n => n.id === id);

export const getNodesByType = (type: KnowledgeGraphNode['type']): KnowledgeGraphNode[] => 
  knowledgeNodes.filter(n => n.type === type);

export const getConnectedNodes = (nodeId: string): KnowledgeGraphNode[] => {
  const connectedIds = knowledgeEdges
    .filter(e => e.source === nodeId || e.target === nodeId)
    .flatMap(e => [e.source, e.target])
    .filter(id => id !== nodeId);
  return knowledgeNodes.filter(n => connectedIds.includes(n.id));
};

export const getEdgesForNode = (nodeId: string): KnowledgeGraphEdge[] => 
  knowledgeEdges.filter(e => e.source === nodeId || e.target === nodeId);
