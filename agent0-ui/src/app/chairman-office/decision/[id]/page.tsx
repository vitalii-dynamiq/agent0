'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getDecisionById, getStakeholderById, getDepartmentById } from '@/lib/mock-data';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { CeoPillarBadge } from '@/components/shared/ceo-pillar-badge';
import { AuthorityBarometerCard } from '@/components/shared/authority-barometer';
import { AdeoEvaluationFlow } from '@/components/shared/adeo-evaluation-flow';
import { WorkflowTimeline } from '@/components/shared/workflow-timeline';
import { cn } from '@/lib/utils';
import {
  ArrowLeftIcon,
  CheckIcon,
  Cross2Icon,
  ChatBubbleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  RocketIcon,
} from '@radix-ui/react-icons';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ChairmanDecisionDetail({ params }: PageProps) {
  const router = useRouter();
  const { id } = use(params);
  const decision = getDecisionById(id);
  const [showApproveConfirm, setShowApproveConfirm] = useState(false);
  const [showRejectConfirm, setShowRejectConfirm] = useState(false);
  const [showExecuteDialog, setShowExecuteDialog] = useState(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  if (!decision) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-20 text-center">
        <h1 className="text-2xl font-semibold text-foreground mb-2">Decision Not Found</h1>
        <p className="text-muted-foreground mb-6">The requested decision could not be found.</p>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  const requester = getStakeholderById(decision.requesterId);
  const department = getDepartmentById(decision.departmentId);
  const executionOwner = decision.execution?.owner ?? 'Delivery PMO';
  const executionMilestones = decision.execution?.milestones ?? [];
  const executionSystems = ['PMO Execution Hub', 'ADEO Workflow', 'Microsoft Teams', 'SharePoint Decision Pack'];
  const executionSteps = [
    `Create delivery workstream for ${decision.title}.`,
    `Assign ${executionOwner} as execution owner and notify stakeholders.`,
    `Kick off milestone plan with ${executionMilestones.length || 3} tracked checkpoints.`,
    'Start automated status updates back to the decision audit trail.',
  ];

  const formatValue = (value?: number) => {
    if (!value) return '—';
    if (value >= 1000000) return `AED ${(value / 1000000).toFixed(0)}M`;
    if (value >= 1000) return `AED ${(value / 1000).toFixed(0)}K`;
    return `AED ${value}`;
  };

  const handleApprove = () => {
    router.push('/chairman-office/decisions');
  };

  const handleReject = () => {
    router.push('/chairman-office/decisions');
  };

  const handleRequestInfo = () => {
    setActionNotice(`Follow-up request sent to ${requester?.name || 'requester'}.`);
  };

  const handleExecuteConfirm = () => {
    setActionNotice('Execution authorized. PMO execution plan created and owners notified.');
    setShowExecuteDialog(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 py-4 sm:py-8">
      {/* Back Button */}
      <div className="mb-4 sm:mb-6">
        <Button 
          variant="ghost" 
          onClick={() => router.back()}
          className="text-muted-foreground hover:text-foreground -ml-2"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Back to Decisions
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header Card */}
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <span className="text-[10px] sm:text-[11px] text-muted-foreground px-1.5 sm:px-2 py-0.5 sm:py-1 border border-border rounded whitespace-nowrap">
                    Level {decision.level}
                  </span>
                  <span className="text-[10px] sm:text-[11px] text-muted-foreground px-1.5 sm:px-2 py-0.5 sm:py-1 border border-border rounded capitalize whitespace-nowrap">
                    {decision.category}
                  </span>
                  <CeoPillarBadge pillar={decision.ceoPillar} />
                  {decision.escalatedFrom && (
                    <span className="text-[10px] sm:text-[11px] text-muted-foreground px-1.5 sm:px-2 py-0.5 sm:py-1 border border-border rounded whitespace-nowrap">
                      Escalated from L{decision.escalatedFrom}
                    </span>
                  )}
                </div>
                <span className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-muted-foreground px-1.5 sm:px-2 py-0.5 sm:py-1 border border-border rounded self-start whitespace-nowrap">
                  <ClockIcon className="w-3 h-3" />
                  Due {new Date(decision.dueDate).toLocaleDateString('en-AE', { day: 'numeric', month: 'short' })}
                </span>
              </div>

              <h1 className="text-lg sm:text-xl font-semibold text-foreground mb-2 sm:mb-3">
                {decision.title}
              </h1>
              <p className="text-[13px] sm:text-[14px] text-muted-foreground mb-4 sm:mb-6">
                {decision.description}
              </p>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-4 border-t border-border">
                <div>
                  <p className="text-[11px] text-muted-foreground mb-1">Value</p>
                  <p className="text-lg font-semibold text-foreground tabular-nums">
                    {formatValue(decision.value)}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground mb-1">Department</p>
                  <p className="text-[14px] font-medium text-foreground">
                    {department?.shortName || '—'}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground mb-1">Requester</p>
                  <p className="text-[14px] font-medium text-foreground">
                    {requester?.name || '—'}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground mb-1">Submitted</p>
                  <p className="text-[14px] font-medium text-foreground">
                    {new Date(decision.createdAt).toLocaleDateString('en-AE', { 
                      day: 'numeric', 
                      month: 'short',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Analysis Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-[15px] font-medium">AI Analysis</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-start gap-6">
                {/* Confidence */}
                <div className="text-center">
                  <div className="relative w-20 h-20">
                    <svg className="w-20 h-20 transform -rotate-90">
                      <circle
                        cx="40"
                        cy="40"
                        r="36"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        className="text-secondary"
                      />
                      <circle
                        cx="40"
                        cy="40"
                        r="36"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${(decision.aiConfidence || 0) * 2.26} 226`}
                        className="text-primary"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-semibold tabular-nums">{decision.aiConfidence}%</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1">Confidence</p>
                </div>

                {/* Recommendation */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[13px] text-muted-foreground">Recommendation:</span>
                    <span className="text-[12px] font-medium px-2 py-0.5 bg-secondary rounded uppercase">
                      {decision.aiRecommendation}
                    </span>
                  </div>
                  <p className="text-[13px] text-foreground leading-relaxed">
                    {decision.aiReasoning}
                  </p>
                </div>
              </div>

              {decision.escalationReason && (
                <div className="mt-4 p-3 rounded-lg border border-border bg-secondary/50">
                  <div className="flex items-center gap-2 mb-1">
                    <ExclamationTriangleIcon className="w-4 h-4 text-muted-foreground" />
                    <span className="text-[12px] font-medium text-foreground">Escalation Reason</span>
                  </div>
                  <p className="text-[13px] text-muted-foreground">{decision.escalationReason}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <AuthorityBarometerCard authority={decision.authorityBarometer} />
            <AdeoEvaluationFlow steps={decision.adeoFlow} />
          </div>

          <WorkflowTimeline steps={decision.workflowSteps} />

          {/* Precedents */}
          {decision.precedents && decision.precedents.length > 0 && (
            <Card>
              <CardHeader className="pb-3 px-4 sm:px-6">
                <CardTitle className="text-[15px] font-medium">Historical Precedents</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 px-4 sm:px-6">
                <div className="space-y-2">
                  {decision.precedents.map((precedent) => (
                    <Button
                      key={precedent.id}
                      type="button"
                      onClick={() => precedent.precedentDecisionId && router.push(`/chairman-office/decision/${precedent.precedentDecisionId}`)}
                      variant="outline"
                      size="sm"
                      className={cn(
                        "w-full h-auto flex-col sm:flex-row sm:justify-between p-3 text-left border border-border transition-colors gap-2 sm:gap-4",
                        precedent.precedentDecisionId
                          ? "hover:bg-secondary/50 cursor-pointer"
                          : "cursor-default"
                      )}
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-[13px] font-medium text-foreground line-clamp-2 sm:line-clamp-1">{precedent.title}</p>
                        <p className="text-[11px] text-muted-foreground">
                          {new Date(precedent.date).toLocaleDateString('en-AE', { 
                            month: 'short', 
                            year: 'numeric' 
                          })}
                        </p>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 flex-shrink-0">
                        <div className="sm:text-right">
                          <p className="text-[11px] text-muted-foreground">Similarity</p>
                          <p className="text-[13px] font-medium text-foreground tabular-nums">{precedent.similarity}%</p>
                        </div>
                        <span className="text-[11px] px-2 py-0.5 bg-secondary rounded capitalize whitespace-nowrap">
                          {precedent.outcome}
                        </span>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

        </div>

        {/* Sidebar */}
        <div className="space-y-4 sm:space-y-6">
          {/* Action Card - with glow to draw attention */}
          <Card className="lg:sticky lg:top-24 glow-border-subtle">
            <CardContent className="p-4 sm:p-6">
              <h3 className="text-[14px] font-semibold text-foreground mb-4">Your Decision</h3>
              
              {actionNotice && (
                <div className="mb-3 rounded-lg border border-border bg-secondary/40 p-3 text-[12px] text-foreground">
                  {actionNotice}
                </div>
              )}

              {!showApproveConfirm && !showRejectConfirm ? (
                <div className="space-y-2">
                  <button 
                    className="btn-approve w-full flex items-center justify-center"
                    onClick={() => {
                      setShowApproveConfirm(true);
                      setShowRejectConfirm(false);
                    }}
                  >
                    <CheckIcon className="w-4 h-4 mr-2" />
                    Approve
                  </button>
                  <button
                    className="btn-reject w-full flex items-center justify-center"
                    onClick={() => {
                      setShowRejectConfirm(true);
                      setShowApproveConfirm(false);
                    }}
                  >
                    <Cross2Icon className="w-4 h-4 mr-2" />
                    Reject
                  </button>
                  <Button variant="outline" className="w-full" onClick={handleRequestInfo}>
                    <ChatBubbleIcon className="w-4 h-4 mr-2" />
                    Request More Info
                  </Button>
                  <Dialog open={showExecuteDialog} onOpenChange={setShowExecuteDialog}>
                    <DialogTrigger asChild>
                      <button className="btn-execute w-full flex items-center justify-center">
                        <RocketIcon className="w-4 h-4 mr-2" />
                        Execute
                      </button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Confirm execution</DialogTitle>
                        <DialogDescription>
                          Review the execution plan and systems impacted before initiating delivery.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 text-[13px]">
                        <div className="rounded-lg border border-border bg-secondary/30 p-3">
                          <div className="flex items-center justify-between text-[12px]">
                            <span className="text-muted-foreground">Execution owner</span>
                            <span className="text-foreground">{executionOwner}</span>
                          </div>
                          <div className="mt-2 flex items-center justify-between text-[12px]">
                            <span className="text-muted-foreground">Decision value</span>
                            <span className="text-foreground">{formatValue(decision.value)}</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-[11px] uppercase tracking-wide text-muted-foreground mb-2">What will happen</p>
                          <ul className="space-y-2">
                            {executionSteps.map((step, index) => (
                              <li key={index} className="flex gap-2 text-[12px] sm:text-[13px]">
                                <span className="text-muted-foreground flex-shrink-0">•</span>
                                <span className="text-foreground">{step}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="text-[11px] uppercase tracking-wide text-muted-foreground mb-2">Systems touched</p>
                          <div className="flex flex-wrap gap-1.5 sm:gap-2">
                            {executionSystems.map((system) => (
                              <Badge key={system} variant="outline" className="text-[10px]">
                                {system}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-[11px] uppercase tracking-wide text-muted-foreground mb-2">Milestones</p>
                          <div className="space-y-2">
                            {executionMilestones.length > 0 ? (
                              executionMilestones.map((milestone) => (
                                <div
                                  key={milestone.id}
                                  className="flex items-center justify-between rounded-lg border border-border/70 px-3 py-2 text-[12px]"
                                >
                                  <div className="min-w-0 flex-1 mr-2">
                                    <p className="text-foreground truncate">{milestone.title}</p>
                                    <p className="text-[11px] text-muted-foreground capitalize">
                                      {milestone.status.replace('_', ' ')}
                                    </p>
                                  </div>
                                  <span className="text-muted-foreground flex-shrink-0">{milestone.eta ?? '—'}</span>
                                </div>
                              ))
                            ) : (
                              <p className="text-[12px] text-muted-foreground">
                                Milestones will be generated after execution is authorized.
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      <DialogFooter className="gap-2 sm:justify-end flex-col-reverse sm:flex-row mt-4">
                        <DialogClose asChild>
                          <Button variant="outline" className="w-full sm:w-auto">Cancel</Button>
                        </DialogClose>
                        <button
                          className="btn-execute w-full sm:w-auto"
                          onClick={handleExecuteConfirm}
                        >
                          Confirm execution
                        </button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-secondary/50 border border-border glow-border-subtle">
                    <p className="text-[13px] text-foreground mb-2 font-medium">
                      {showRejectConfirm ? 'Confirm rejection?' : 'Confirm approval?'}
                    </p>
                    <p className="text-[12px] text-muted-foreground">
                      {showRejectConfirm
                        ? 'This will return the decision to the intake queue with a rejection note.'
                        : `This will authorize the execution of this ${formatValue(decision.value)} decision.`}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      className={showRejectConfirm ? "btn-reject flex-1" : "btn-approve flex-1"}
                      onClick={showRejectConfirm ? handleReject : handleApprove}
                    >
                      Confirm
                    </button>
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => {
                        setShowApproveConfirm(false);
                        setShowRejectConfirm(false);
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Risk Assessment */}
          {decision.riskAssessment && (
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-[14px] font-medium">Risk Assessment</CardTitle>
                  <span className="text-[11px] px-2 py-0.5 bg-secondary rounded capitalize">
                    {decision.riskAssessment.overall} risk
                  </span>
                </div>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                <RiskBar label="Financial" level={decision.riskAssessment.financial} />
                <RiskBar label="Operational" level={decision.riskAssessment.operational} />
                <RiskBar label="Reputational" level={decision.riskAssessment.reputational} />
                
                {decision.riskAssessment.factors && (
                  <div className="pt-3 border-t border-border">
                    <p className="text-[11px] text-muted-foreground mb-2">Key Factors</p>
                    <ul className="space-y-1">
                      {decision.riskAssessment.factors.map((factor, i) => (
                        <li key={i} className="text-[12px] text-foreground flex items-start gap-2">
                          <span className="text-muted-foreground">•</span>
                          {factor}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

        </div>
      </div>
    </div>
  );
}

function RiskBar({ label, level }: { label: string; level: 'low' | 'medium' | 'high' | 'critical' }) {
  const value = level === 'low' ? 25 : level === 'medium' ? 50 : level === 'high' ? 75 : 100;
  
  const textColorClass = {
    low: 'risk-text-low',
    medium: 'risk-text-medium',
    high: 'risk-text-high',
    critical: 'risk-text-critical',
  }[level];
  
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[11px] text-muted-foreground">{label}</span>
        <span className={`text-[11px] font-medium capitalize ${textColorClass}`}>{level}</span>
      </div>
      <div className="risk-bar-track">
        <div 
          className="risk-bar-fill" 
          data-level={level}
          style={{ width: `${value}%` }} 
        />
      </div>
    </div>
  );
}
