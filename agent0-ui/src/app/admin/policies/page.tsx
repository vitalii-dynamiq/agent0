'use client';

import { useState, useMemo } from 'react';
import { policies } from '@/lib/mock-data';
import { Policy, PolicyStatus, PolicyCategory } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { 
  MagnifyingGlassIcon,
  FileTextIcon,
  GlobeIcon,
  LayersIcon,
  GearIcon,
  PersonIcon,
  LockClosedIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CopyIcon,
  Cross2Icon,
  ArrowDownIcon,
  PlusIcon,
} from '@radix-ui/react-icons';

const categoryConfig: Record<PolicyCategory, { 
  icon: React.ComponentType<{ className?: string }>; 
  label: string;
}> = {
  governance: { icon: GlobeIcon, label: 'Governance' },
  financial: { icon: LayersIcon, label: 'Financial' },
  operational: { icon: GearIcon, label: 'Operational' },
  hr: { icon: PersonIcon, label: 'HR' },
  security: { icon: LockClosedIcon, label: 'Security' },
  compliance: { icon: FileTextIcon, label: 'Compliance' },
};

export default function PoliciesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(policies[0]);
  const [expandedRules, setExpandedRules] = useState<Set<string>>(new Set());
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [newPolicyName, setNewPolicyName] = useState('');
  const [newPolicyDescription, setNewPolicyDescription] = useState('');
  const [newPolicySource, setNewPolicySource] = useState('');
  const [newPolicyOwner, setNewPolicyOwner] = useState('Policy Office');
  const [newEffectiveDate, setNewEffectiveDate] = useState('');
  const [newPolicyCategory, setNewPolicyCategory] = useState<PolicyCategory>('governance');
  const [newPolicyStatus, setNewPolicyStatus] = useState<PolicyStatus>('under_review');
  const [showPolicyList, setShowPolicyList] = useState(true);

  const stats = useMemo(() => ({
    total: policies.length,
    active: policies.filter(p => p.status === 'active').length,
    underReview: policies.filter(p => p.status === 'under_review').length,
    totalRules: policies.reduce((acc, p) => acc + p.rules.length, 0),
  }), []);

  const filteredPolicies = useMemo(() => {
    if (!searchQuery) return policies;
    const query = searchQuery.toLowerCase();
    return policies.filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const toggleRule = (ruleId: string) => {
    setExpandedRules(prev => {
      const next = new Set(prev);
      if (next.has(ruleId)) next.delete(ruleId);
      else next.add(ruleId);
      return next;
    });
  };

  const handleCreatePolicy = () => {
    const label = newPolicyName.trim() || 'New policy';
    setActionNotice(`${label} added to ingestion queue.`);
    setIsAddOpen(false);
    setNewPolicyName('');
    setNewPolicyDescription('');
    setNewPolicySource('');
    setNewPolicyOwner('Policy Office');
    setNewEffectiveDate('');
    setNewPolicyCategory('governance');
    setNewPolicyStatus('under_review');
    setTimeout(() => setActionNotice(null), 3000);
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-background">
      {/* Header */}
      <div className="px-4 sm:px-6 py-4 sm:py-6 border-b border-border">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-lg sm:text-xl font-semibold tracking-tight">Policies</h1>
            <p className="text-[13px] sm:text-sm text-muted-foreground mt-1">
              Policies are ingested from enterprise sources and visualized here for enforcement rules.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="w-full sm:w-auto">
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Add Policy
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                  <DialogTitle>Add policy</DialogTitle>
                  <DialogDescription>
                    Upload or register a policy so it can be ingested into the enforcement engine.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <span className="text-[12px] text-muted-foreground">Policy name</span>
                    <Input
                      value={newPolicyName}
                      onChange={(e) => setNewPolicyName(e.target.value)}
                      placeholder="Responsible AI Governance Framework"
                    />
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <div className="grid gap-2">
                      <span className="text-[12px] text-muted-foreground">Category</span>
                      <Select value={newPolicyCategory} onValueChange={(value) => setNewPolicyCategory(value as PolicyCategory)}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.keys(categoryConfig).map((category) => (
                            <SelectItem key={category} value={category}>
                              {categoryConfig[category as PolicyCategory].label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <span className="text-[12px] text-muted-foreground">Status</span>
                      <Select value={newPolicyStatus} onValueChange={(value) => setNewPolicyStatus(value as PolicyStatus)}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="under_review">Under review</SelectItem>
                          <SelectItem value="draft">Draft</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <div className="grid gap-2">
                      <span className="text-[12px] text-muted-foreground">Owner</span>
                      <Input
                        value={newPolicyOwner}
                        onChange={(e) => setNewPolicyOwner(e.target.value)}
                        placeholder="Policy Office"
                      />
                    </div>
                    <div className="grid gap-2">
                      <span className="text-[12px] text-muted-foreground">Effective date</span>
                      <Input
                        type="date"
                        value={newEffectiveDate}
                        onChange={(e) => setNewEffectiveDate(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <span className="text-[12px] text-muted-foreground">Source location</span>
                    <Input
                      value={newPolicySource}
                      onChange={(e) => setNewPolicySource(e.target.value)}
                      placeholder="SharePoint / data room link"
                    />
                  </div>
                  <div className="grid gap-2">
                    <span className="text-[12px] text-muted-foreground">Description</span>
                    <Textarea
                      value={newPolicyDescription}
                      onChange={(e) => setNewPolicyDescription(e.target.value)}
                      placeholder="Summarize how this policy should be enforced."
                      className="min-h-[120px]"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="ghost" onClick={() => setIsAddOpen(false)}>
                    Cancel
                  </Button>
                  <button type="button" className="btn-execute" onClick={handleCreatePolicy}>
                    Create policy
                  </button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:flex sm:items-center gap-4 sm:gap-10 mt-4 sm:mt-6">
          <div>
            <p className="text-xl sm:text-2xl font-semibold tabular-nums">{stats.total}</p>
            <p className="text-[11px] sm:text-sm text-muted-foreground">Total policies</p>
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-semibold tabular-nums">{stats.active}</p>
            <p className="text-[11px] sm:text-sm text-muted-foreground">Active</p>
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-semibold tabular-nums">{stats.underReview}</p>
            <p className="text-[11px] sm:text-sm text-muted-foreground">Under review</p>
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-semibold tabular-nums">{stats.totalRules}</p>
            <p className="text-[11px] sm:text-sm text-muted-foreground">Total rules</p>
          </div>
        </div>
      </div>

      {actionNotice && (
        <div className="fixed bottom-6 right-6 bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow-lg text-sm z-50">
          {actionNotice}
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Policy List - Hidden on mobile when policy is selected */}
        <div className={cn(
          "md:w-80 border-b md:border-b-0 md:border-r border-border flex flex-col",
          selectedPolicy && !showPolicyList ? "hidden md:flex" : "flex"
        )}>
          <div className="p-3 sm:p-4 border-b border-border space-y-3">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search policies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          
          <ScrollArea className="flex-1 max-h-[40vh] md:max-h-none">
            <div className="p-2 space-y-1">
              {filteredPolicies.map(policy => {
                const catConfig = categoryConfig[policy.category];
                const Icon = catConfig.icon;
                
                return (
                  <Button
                    key={policy.id}
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setSelectedPolicy(policy);
                      setShowPolicyList(false);
                    }}
                    className={cn(
                      "w-full h-auto text-left p-3 rounded-lg transition-all justify-start items-start",
                      selectedPolicy?.id === policy.id
                        ? "bg-secondary"
                        : "hover:bg-secondary/50"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {policy.name}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          {policy.status === 'active' && (
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <span className="w-1.5 h-1.5 rounded-full bg-success" />
                              Active
                            </span>
                          )}
                          {policy.status === 'draft' && (
                            <span className="text-xs text-muted-foreground">Draft</span>
                          )}
                          {policy.status === 'under_review' && (
                            <span className="text-xs text-muted-foreground">Under Review</span>
                          )}
                          <span className="text-xs text-muted-foreground">v{policy.version}</span>
                        </div>
                      </div>
                    </div>
                  </Button>
                );
              })}
            </div>
          </ScrollArea>
        </div>

        {/* Policy Details */}
        {selectedPolicy ? (
          <div className={cn(
            "flex-1 flex flex-col overflow-hidden",
            showPolicyList ? "hidden md:flex" : "flex"
          )}>
            {/* Policy Header */}
            <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-border">
              {/* Back button on mobile */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPolicyList(true)}
                className="md:hidden mb-3 -ml-2 text-muted-foreground"
              >
                <Cross2Icon className="w-4 h-4 mr-1 rotate-45" />
                Back to policies
              </Button>
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                <div>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                    <h2 className="text-base sm:text-lg font-semibold">{selectedPolicy.name}</h2>
                    {selectedPolicy.status === 'active' && (
                      <span className="flex items-center gap-1.5 text-sm">
                        <span className="w-2 h-2 rounded-full bg-success" />
                        Active
                      </span>
                    )}
                    {selectedPolicy.status !== 'active' && (
                      <span className="text-sm text-muted-foreground capitalize">
                        {selectedPolicy.status.replace('_', ' ')}
                      </span>
                    )}
                  </div>
                  <p className="text-[13px] sm:text-sm text-muted-foreground max-w-2xl">{selectedPolicy.description}</p>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-3 text-[12px] sm:text-sm text-muted-foreground">
                    <span>Version {selectedPolicy.version}</span>
                    <span className="hidden sm:inline">·</span>
                    <span>Effective {new Date(selectedPolicy.effectiveDate).toLocaleDateString('en-AE')}</span>
                    <span className="hidden sm:inline">·</span>
                    <span>By {selectedPolicy.createdBy}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 flex overflow-hidden">
              <ScrollArea className="flex-1">
                <div className="p-4 sm:p-6">
                  <div className="space-y-3">
                    {selectedPolicy.rules.map((rule, index) => {
                      const isExpanded = expandedRules.has(rule.id);
                      return (
                        <div key={rule.id} className="border border-border rounded-lg overflow-hidden">
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => toggleRule(rule.id)}
                            className="w-full h-auto justify-between p-4 hover:bg-secondary/50 transition-colors text-left items-start"
                          >
                            <div className="flex items-center gap-4">
                              <span className="text-sm font-medium tabular-nums text-muted-foreground">
                                #{index + 1}
                              </span>
                              <div>
                                <p className="text-sm font-medium">Rule {index + 1}</p>
                                <p className="text-xs text-muted-foreground mt-0.5">Priority: {rule.priority}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-xs text-muted-foreground">Active</span>
                              {isExpanded ? (
                                <ChevronUpIcon className="w-4 h-4 text-muted-foreground" />
                              ) : (
                                <ChevronDownIcon className="w-4 h-4 text-muted-foreground" />
                              )}
                            </div>
                          </Button>
                          
                          {isExpanded && (
                            <div className="px-4 pb-4 space-y-4 border-t border-border pt-4">
                              {/* Condition */}
                              <div>
                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">IF (Condition)</p>
                                <code className="text-sm font-mono block p-3 bg-secondary rounded-md">{rule.condition}</code>
                              </div>
                              
                              <div className="flex justify-center">
                                <ArrowDownIcon className="w-4 h-4 text-muted-foreground" />
                              </div>
                              
                              {/* Action */}
                              <div>
                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">THEN (Action)</p>
                                <p className="text-sm p-3 bg-secondary rounded-md">{rule.action}</p>
                              </div>
                              
                              {/* Actions */}
                              <div className="flex items-center gap-2 pt-3 border-t border-border">
                                <Button variant="ghost" size="sm" className="text-sm">
                                  <CopyIcon className="w-4 h-4 mr-1.5" />
                                  Duplicate
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                    
                    {/* Add Rule Button */}
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full h-auto p-4 rounded-lg border border-dashed border-border hover:border-foreground/30 hover:bg-secondary/50 transition-colors flex items-center justify-center gap-2 text-muted-foreground"
                    >
                      <PlusIcon className="w-4 h-4" />
                      <span className="text-sm font-medium">Add enforcement rule</span>
                    </Button>
                  </div>
                </div>
              </ScrollArea>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <p className="text-sm">Select a policy to view details</p>
          </div>
        )}
      </div>
    </div>
  );
}
