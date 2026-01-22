'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  HiOutlineLink,
  HiOutlineDocumentText,
  HiOutlineRocketLaunch,
  HiOutlineCalendarDays,
  HiOutlineFolderOpen,
} from 'react-icons/hi2';
import {
  SiOracle,
  SiSalesforce,
  SiDatabricks,
  SiJira,
} from 'react-icons/si';
import { PiMicrosoftOutlookLogo, PiMicrosoftTeamsLogo } from 'react-icons/pi';
import { TbBrandOnedrive } from 'react-icons/tb';
import { FaMicrosoft } from 'react-icons/fa6';
import { RiExchangeBoxLine, RiTerminalBoxLine } from 'react-icons/ri';

const integrations = [
  {
    id: 'oracle-erp',
    name: 'Oracle Fusion ERP',
    description: 'Budget approvals, procurement records, and financial artifacts.',
    status: 'connected',
    category: 'Core Systems',
    icon: SiOracle,
    action: 'Configure',
    readiness: 82,
    freshness: '2h ago',
    sla: 'Near real-time',
  },
  {
    id: 'ecas',
    name: 'ECAS',
    description: 'Executive council submissions and workflow approvals.',
    status: 'pending',
    category: 'Governance',
    icon: HiOutlineDocumentText,
    action: 'Connect',
    readiness: 48,
    freshness: 'Not synced',
    sla: 'Daily',
  },
  {
    id: 'tamm-platform',
    name: 'TAMM Platform',
    description: 'Unified government services platform data feeds.',
    status: 'connected',
    category: 'Core Systems',
    icon: HiOutlineRocketLaunch,
    action: 'View status',
    readiness: 77,
    freshness: '6h ago',
    sla: 'Daily',
  },
  {
    id: 'crm',
    name: 'Salesforce CRM',
    description: 'Citizen relationship data, service cases, and engagement history.',
    status: 'pending',
    category: 'Business Systems',
    icon: SiSalesforce,
    action: 'Connect',
    readiness: 41,
    freshness: 'Not synced',
    sla: 'Daily',
  },
  {
    id: 'hris',
    name: 'Oracle HR System',
    description: 'Workforce records, staffing updates, and talent profiles.',
    status: 'pending',
    category: 'Business Systems',
    icon: SiOracle,
    action: 'Connect',
    readiness: 36,
    freshness: 'Not synced',
    sla: 'Daily',
  },
  {
    id: 'databricks',
    name: 'Databricks Data Lake',
    description: 'Enterprise analytics, data lakehouse pipelines, and model training datasets.',
    status: 'pending',
    category: 'Data Platform',
    icon: SiDatabricks,
    action: 'Configure',
    readiness: 52,
    freshness: 'Not synced',
    sla: 'Daily',
  },
  {
    id: 'jira',
    name: 'Jira',
    description: 'Project milestones, delivery blockers, and sprint status signals.',
    status: 'pending',
    category: 'Project Management',
    icon: SiJira,
    action: 'Connect',
    readiness: 28,
    freshness: 'Not synced',
    sla: 'Daily',
  },
  {
    id: 'sharepoint',
    name: 'Microsoft SharePoint',
    description: 'Policy libraries, governance documents, and decision packs.',
    status: 'connected',
    category: 'Knowledge',
    icon: FaMicrosoft,
    action: 'Sync now',
    readiness: 69,
    freshness: '3h ago',
    sla: 'Daily',
  },
  {
    id: 'onedrive',
    name: 'Microsoft OneDrive',
    description: 'Executive briefing packs and working documents.',
    status: 'pending',
    category: 'Knowledge',
    icon: TbBrandOnedrive,
    action: 'Connect',
    readiness: 33,
    freshness: 'Not synced',
    sla: 'Daily',
  },
  {
    id: 'outlook',
    name: 'Microsoft Outlook',
    description: 'Executive communications, approvals, and audit trails.',
    status: 'connected',
    category: 'Communication',
    icon: PiMicrosoftOutlookLogo,
    action: 'View logs',
    readiness: 88,
    freshness: '45m ago',
    sla: 'Near real-time',
  },
  {
    id: 'exchange',
    name: 'Microsoft Exchange',
    description: 'Enterprise mail routing, compliance retention, and archival logs.',
    status: 'connected',
    category: 'Communication',
    icon: RiExchangeBoxLine,
    action: 'View logs',
    readiness: 84,
    freshness: '1h ago',
    sla: 'Near real-time',
  },
  {
    id: 'calendar',
    name: 'Executive Calendar',
    description: 'Meeting schedules, follow-ups, and availability.',
    status: 'connected',
    category: 'Schedule',
    icon: HiOutlineCalendarDays,
    action: 'Sync now',
    readiness: 83,
    freshness: '1h ago',
    sla: 'Near real-time',
  },
  {
    id: 'teams',
    name: 'Microsoft Teams',
    description: 'Meeting recordings, transcripts, and highlights.',
    status: 'pending',
    category: 'Meetings',
    icon: PiMicrosoftTeamsLogo,
    action: 'Connect',
    readiness: 46,
    freshness: 'Not synced',
    sla: 'Daily',
  },
  {
    id: 'bloomberg',
    name: 'Bloomberg Terminal',
    description: 'Market intelligence, macro indicators, and executive briefings.',
    status: 'pending',
    category: 'External Intelligence',
    icon: RiTerminalBoxLine,
    action: 'Connect',
    readiness: 22,
    freshness: 'Not synced',
    sla: 'Daily',
  },
];

const statusStyles: Record<string, string> = {
  connected: 'bg-success/10 text-success',
  pending: 'bg-secondary text-muted-foreground',
  disconnected: 'bg-destructive/10 text-destructive',
};

export default function IntegrationsPage() {
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold">Integrations</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Connect enterprise systems that feed the knowledge graph and policy engine.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setActionMessage('Integration intake opened. Select a source to begin configuration.')}
          >
            <HiOutlineLink className="w-4 h-4 mr-2" />
            Add integration
          </Button>
        </div>
      </div>

      {actionMessage && (
        <div className="rounded-lg border border-border bg-secondary/40 px-4 py-3 text-[13px] text-foreground">
          {actionMessage}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {integrations.map((integration) => {
          const Icon = integration.icon;
          return (
            <Card key={integration.id} className="border-border/60">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-3 text-base">
                  <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center">
                    <Icon className="w-4 h-4 text-foreground" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span>{integration.name}</span>
                      <Badge className={cn('text-[10px] uppercase tracking-wide', statusStyles[integration.status])}>
                        {integration.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{integration.category}</p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{integration.description}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Freshness: {integration.freshness}</span>
                  <Badge variant="outline" className="text-[10px] uppercase tracking-wide">
                    {integration.sla}
                  </Badge>
                </div>
                <div>
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1">
                    <span>Data readiness</span>
                    <span>{integration.readiness}%</span>
                  </div>
                  <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-foreground rounded-full"
                      style={{ width: `${integration.readiness}%` }}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-end">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setActionMessage(`${integration.name} queued for ${integration.action.toLowerCase()}.`)}
                  >
                    {integration.action}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
