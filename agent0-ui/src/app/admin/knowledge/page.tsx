'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { dataSources, knowledgeNodes, knowledgeEdges, getConnectedNodes, getEdgesForNode } from '@/lib/mock-data';
import { KnowledgeGraphNode, KnowledgeNodeType, KnowledgeGraphEdge } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { 
  MagnifyingGlassIcon,
  FileTextIcon,
  PersonIcon,
  CubeIcon,
  Cross2Icon,
  ChevronRightIcon,
  GlobeIcon,
  LockClosedIcon,
  TokensIcon,
} from '@radix-ui/react-icons';

type IconProps = { className?: string };
const nodeTypeConfig: Record<KnowledgeNodeType, { 
  icon: React.ComponentType<IconProps>; 
  label: string 
}> = {
  person: { icon: PersonIcon, label: 'People' },
  department: { icon: GlobeIcon, label: 'Departments' },
  decision: { icon: TokensIcon, label: 'Decisions' },
  policy: { icon: LockClosedIcon, label: 'Policies' },
  project: { icon: CubeIcon, label: 'Projects' },
  document: { icon: FileTextIcon, label: 'Documents' },
};

function calculateNodePosition(index: number, total: number, width: number, height: number) {
  const centerX = width / 2;
  const centerY = height / 2;
  const baseRadius = Math.min(width, height) * 0.35;
  const radiusVariation = (index % 3) * 25;
  const radius = baseRadius + radiusVariation;
  const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
  
  return {
    x: centerX + radius * Math.cos(angle),
    y: centerY + radius * Math.sin(angle),
  };
}

export default function ContextGraphPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNode, setSelectedNode] = useState<KnowledgeGraphNode | null>(null);
  const [selectedTypes, setSelectedTypes] = useState<KnowledgeNodeType[]>([]);
  const [activeTab, setActiveTab] = useState('explorer');
  const [graphDimensions, setGraphDimensions] = useState({ width: 800, height: 500 });
  const graphContainerRef = useRef<HTMLDivElement>(null);
  const hasSelection = Boolean(selectedNode);

  useEffect(() => {
    const updateDimensions = () => {
      if (graphContainerRef.current) {
        const { width, height } = graphContainerRef.current.getBoundingClientRect();
        setGraphDimensions({ width, height });
      }
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [activeTab]);

  const stats = useMemo(() => ({
    totalDocuments: dataSources.reduce((acc, s) => acc + s.documentsCount, 0),
    totalEntities: knowledgeNodes.length,
    totalConnections: knowledgeEdges.length,
  }), []);

  const entityCounts = useMemo(() => {
    const counts: Record<KnowledgeNodeType, number> = {
      person: 0, department: 0, decision: 0, policy: 0, project: 0, document: 0,
    };
    knowledgeNodes.forEach(node => { counts[node.type]++; });
    return counts;
  }, []);

  const filteredNodes = useMemo(() => {
    let nodes = knowledgeNodes;
    if (selectedTypes.length > 0) {
      nodes = nodes.filter(n => selectedTypes.includes(n.type));
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      nodes = nodes.filter(n => 
        n.label.toLowerCase().includes(query) ||
        n.description?.toLowerCase().includes(query)
      );
    }
    return nodes;
  }, [searchQuery, selectedTypes]);

  const connectedNodes = useMemo(() => {
    if (!selectedNode) return [];
    return getConnectedNodes(selectedNode.id);
  }, [selectedNode]);

  const nodePositions = useMemo(() => {
    const positions: Record<string, { x: number; y: number }> = {};
    filteredNodes.forEach((node, index) => {
      const pos = calculateNodePosition(
        index, filteredNodes.length, graphDimensions.width, graphDimensions.height
      );
      positions[node.id] = {
        x: Math.round(pos.x * 100) / 100,
        y: Math.round(pos.y * 100) / 100,
      };
    });
    return positions;
  }, [filteredNodes, graphDimensions]);

  const visibleEdges = useMemo(() => {
    const nodeIds = new Set(filteredNodes.map(n => n.id));
    return knowledgeEdges.filter(edge => nodeIds.has(edge.source) && nodeIds.has(edge.target));
  }, [filteredNodes]);

  const toggleTypeFilter = (type: KnowledgeNodeType) => {
    setSelectedTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-background">
      {/* Header */}
      <div className="px-6 py-5 border-b border-border">
        <div className="flex items-start justify-between">
          <p className="text-[14px] text-muted-foreground">
            Enterprise knowledge graph for decision context
          </p>
        </div>

        {/* Quick Stats */}
        <div className="flex items-center gap-10 mt-6">
          <div>
            <p className="text-2xl font-semibold tabular-nums">{stats.totalEntities}</p>
            <p className="text-[12px] text-muted-foreground">Entities</p>
          </div>
          <div>
            <p className="text-2xl font-semibold tabular-nums">{stats.totalConnections}</p>
            <p className="text-[12px] text-muted-foreground">Connections</p>
          </div>
          <div>
            <p className="text-2xl font-semibold tabular-nums">{stats.totalDocuments.toLocaleString('en-US')}</p>
            <p className="text-[12px] text-muted-foreground">Documents</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex min-h-0">
        {/* Left Panel */}
        <div className="flex-1 flex flex-col overflow-hidden min-h-0 min-w-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full min-h-0">
            <div className="px-6 py-4 border-b border-border">
              <div className="flex items-center justify-between">
                <TabsList className="bg-secondary p-1">
                  <TabsTrigger value="explorer" className="text-[13px] px-4">Graph</TabsTrigger>
                  <TabsTrigger value="entities" className="text-[13px] px-4">Entities</TabsTrigger>
                </TabsList>
                
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search entities..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 w-64 h-9 text-[13px]"
                    />
                  </div>
                </div>
              </div>
              
              {/* Type filters */}
              <div className="flex items-center gap-2 mt-4">
                <span className="text-[13px] text-muted-foreground">Filter:</span>
                {(Object.keys(nodeTypeConfig) as KnowledgeNodeType[]).map(type => {
                  const config = nodeTypeConfig[type];
                  const Icon = config.icon;
                  const isSelected = selectedTypes.includes(type);
                  return (
                  <Button
                      key={type}
                    type="button"
                    variant="outline"
                    size="sm"
                      onClick={() => toggleTypeFilter(type)}
                      className={cn(
                      "flex items-center gap-2 px-3 py-1.5 rounded-md text-[13px] transition-colors",
                        isSelected
                          ? "bg-accent text-foreground border-primary/30"
                          : "border-border text-muted-foreground hover:text-foreground hover:bg-secondary"
                      )}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{config.label}</span>
                      <span className="text-[11px] tabular-nums opacity-60">({entityCounts[type]})</span>
                  </Button>
                  );
                })}
              </div>
            </div>

            {/* Graph View */}
            <TabsContent value="explorer" className="flex-1 m-0 overflow-hidden min-h-0">
              <div className="h-full p-4 min-h-0">
                <div ref={graphContainerRef} className="h-full min-h-[480px] rounded-lg border border-border bg-card overflow-hidden relative shadow-sm">
                  {/* SVG Edges */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
                    <defs>
                      <marker id="arrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto" fill="var(--muted-foreground)">
                        <polygon points="0 0, 8 3, 0 6" />
                      </marker>
                      <marker id="activeArrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto" fill="var(--primary)">
                        <polygon points="0 0, 8 3, 0 6" />
                      </marker>
                    </defs>
                    
                    {visibleEdges.map((edge) => {
                      const sourcePos = nodePositions[edge.source];
                      const targetPos = nodePositions[edge.target];
                      if (!sourcePos || !targetPos) return null;
                      
                      const isActive = selectedNode && 
                        (edge.source === selectedNode.id || edge.target === selectedNode.id);
                      
                      const dx = targetPos.x - sourcePos.x;
                      const dy = targetPos.y - sourcePos.y;
                      const dist = Math.sqrt(dx * dx + dy * dy);
                      if (dist === 0) return null;
                      
                      const offset = Math.min(dist * 0.12, 20);
                      const midX = Math.round(((sourcePos.x + targetPos.x) / 2 - (dy / dist) * offset) * 100) / 100;
                      const midY = Math.round(((sourcePos.y + targetPos.y) / 2 + (dx / dist) * offset) * 100) / 100;
                      
                      const nodeR = 20;
                      const startX = Math.round((sourcePos.x + (dx / dist) * nodeR) * 100) / 100;
                      const startY = Math.round((sourcePos.y + (dy / dist) * nodeR) * 100) / 100;
                      const endX = Math.round((targetPos.x - (dx / dist) * nodeR) * 100) / 100;
                      const endY = Math.round((targetPos.y - (dy / dist) * nodeR) * 100) / 100;
                      
                      return (
                        <path
                          key={edge.id}
                          d={`M ${startX} ${startY} Q ${midX} ${midY} ${endX} ${endY}`}
                          fill="none"
                          stroke={isActive ? "var(--primary)" : "var(--muted-foreground)"}
                          strokeWidth={isActive ? 1.6 : 1}
                          markerEnd={isActive ? "url(#activeArrow)" : "url(#arrow)"}
                          style={{
                            opacity: selectedNode ? (isActive ? 0.9 : 0.15) : 0.55,
                            transition: 'opacity 200ms',
                          }}
                        />
                      );
                    })}
                  </svg>
                  
                  {/* Nodes */}
                  <div className="absolute inset-0" style={{ zIndex: 2 }}>
                    {filteredNodes.map((node) => {
                      const config = nodeTypeConfig[node.type];
                      const Icon = config.icon;
                      const pos = nodePositions[node.id];
                      if (!pos) return null;
                      
                      const isConnected = selectedNode && (
                        selectedNode.id === node.id ||
                        visibleEdges.some(e => 
                          (e.source === selectedNode.id && e.target === node.id) ||
                          (e.target === selectedNode.id && e.source === node.id)
                        )
                      );
                      
                      return (
                        <Button
                          key={node.id}
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => setSelectedNode(node)}
                          style={{ 
                            left: pos.x, top: pos.y, transform: 'translate(-50%, -50%)',
                            opacity: selectedNode && !isConnected ? 0.2 : 1,
                          }}
                          className={cn(
                            "absolute w-10 h-10 rounded-full flex items-center justify-center p-0",
                            "border bg-card transition-all duration-150 shadow-sm",
                            "hover:scale-110 hover:opacity-100",
                            selectedNode?.id === node.id 
                              ? "border-primary bg-primary text-primary-foreground scale-110 shadow-md" 
                              : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                          )}
                          title={node.label}
                        >
                          <Icon className="w-4 h-4" />
                        </Button>
                      );
                    })}
                    
                    {/* Center hub */}
                    <div 
                      className="absolute w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-sm"
                      style={{ left: Math.round(graphDimensions.width / 2), top: Math.round(graphDimensions.height / 2), transform: 'translate(-50%, -50%)' }}
                    >
                      <span className="text-xs font-medium text-primary-foreground">DGE</span>
                    </div>
                    
                    {/* Selected node labels */}
                    {selectedNode && filteredNodes.map((node) => {
                      const pos = nodePositions[node.id];
                      if (!pos) return null;
                      const isSelected = selectedNode.id === node.id;
                      const isConnected = visibleEdges.some(e => 
                        (e.source === selectedNode.id && e.target === node.id) ||
                        (e.target === selectedNode.id && e.source === node.id)
                      );
                      if (!isSelected && !isConnected) return null;
                      
                      return (
                        <div
                          key={`label-${node.id}`}
                          className="absolute px-2 py-1 rounded bg-card/90 border border-border text-[11px] font-medium max-w-[120px] truncate pointer-events-none shadow-sm"
                          style={{ left: pos.x, top: pos.y + 26, transform: 'translateX(-50%)' }}
                        >
                          {node.label}
                        </div>
                      );
                    })}
                  </div>

                  {/* Stats overlay */}
                  <div className="absolute top-4 left-4 text-[12px] text-muted-foreground">
                    {filteredNodes.length} nodes · {visibleEdges.length} edges
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Entity List View */}
            <TabsContent value="entities" className="flex-1 m-0 overflow-auto min-h-0">
              <div className="p-4">
                <div className="border border-border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border bg-secondary/50">
                        <th className="text-left text-[11px] font-medium text-muted-foreground uppercase tracking-wide px-4 py-3">Entity</th>
                        <th className="text-left text-[11px] font-medium text-muted-foreground uppercase tracking-wide px-4 py-3">Type</th>
                        <th className="text-left text-[11px] font-medium text-muted-foreground uppercase tracking-wide px-4 py-3">Description</th>
                        <th className="text-right text-[11px] font-medium text-muted-foreground uppercase tracking-wide px-4 py-3">Connections</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredNodes.map(node => {
                        const config = nodeTypeConfig[node.type];
                        const Icon = config.icon;
                        const edges = getEdgesForNode(node.id);
                        
                        return (
                          <tr 
                            key={node.id} 
                            className={cn(
                              "border-b border-border last:border-0 hover:bg-secondary/30 transition-colors cursor-pointer",
                              selectedNode?.id === node.id && "bg-secondary"
                            )}
                            onClick={() => setSelectedNode(node)}
                          >
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                                  <Icon className="w-4 h-4 text-muted-foreground" />
                                </div>
                                <span className="text-[13px] font-medium">{node.label}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-[13px] text-muted-foreground">{config.label}</td>
                            <td className="px-4 py-3 text-[13px] text-muted-foreground truncate max-w-xs">
                              {node.description || '—'}
                            </td>
                            <td className="px-4 py-3 text-[13px] text-right tabular-nums">{edges.length}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>

          </Tabs>
        </div>

        {/* Right Panel - Entity Details */}
        {hasSelection && (
          <div className="w-[340px] min-w-[320px] border-l border-border bg-card flex flex-col flex-shrink-0 min-h-0">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
              <h3 className="text-[14px] font-medium">Entity Details</h3>
              <Button variant="ghost" size="sm" onClick={() => setSelectedNode(null)} className="h-8 w-8 p-0">
                <Cross2Icon className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="flex-1 min-h-0 overflow-y-auto">
              <div className="p-5 space-y-6">
                {/* Entity Header */}
                <div>
                  {(() => {
                    const config = nodeTypeConfig[selectedNode!.type];
                    const Icon = config.icon;
                    return (
                      <>
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                            <Icon className="w-5 h-5 text-muted-foreground" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[11px] text-muted-foreground uppercase tracking-wide">{config.label}</p>
                            <h4 className="text-[14px] font-medium truncate">{selectedNode!.label}</h4>
                          </div>
                        </div>
                        <p className="text-[13px] text-muted-foreground">
                          {selectedNode!.description || 'No description available'}
                        </p>
                      </>
                    );
                  })()}
                </div>

                {/* Properties */}
                <div>
                  <h5 className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide mb-3">Properties</h5>
                  <div className="space-y-0">
                    {Object.entries(selectedNode!.properties).map(([key, value]) => (
                      <div key={key} className="grid grid-cols-[120px_1fr] gap-3 py-2.5 border-b border-border last:border-0">
                        <span className="text-[12px] text-muted-foreground capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                        <span className="text-[13px] font-medium text-foreground break-words">
                          {typeof value === 'number' ? value.toLocaleString('en-US') : String(value)}
                        </span>
                      </div>
                    ))}
                    {Object.keys(selectedNode!.properties).length === 0 && (
                      <p className="text-[12px] text-muted-foreground">No properties recorded for this entity.</p>
                    )}
                  </div>
                </div>

                {/* Connections */}
                <div>
                  <h5 className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide mb-3">
                    Connections ({connectedNodes.length})
                  </h5>
                  <div className="space-y-1">
                    {connectedNodes.map(node => {
                      const config = nodeTypeConfig[node.type];
                      const Icon = config.icon;
                      const edge = getEdgesForNode(selectedNode!.id).find(e => e.source === node.id || e.target === node.id);
                      
                      return (
                        <Button
                          key={node.id}
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedNode(node)}
                          className="w-full justify-start gap-3 rounded-lg hover:bg-secondary text-left"
                        >
                          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                            <Icon className="w-4 h-4 text-muted-foreground" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-medium truncate">{node.label}</p>
                            <p className="text-[11px] text-muted-foreground capitalize">
                              {edge?.relationship.replace('_', ' ') || 'connected'}
                            </p>
                          </div>
                          <ChevronRightIcon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        </Button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
