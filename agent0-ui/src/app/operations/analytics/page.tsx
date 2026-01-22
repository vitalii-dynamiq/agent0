'use client';

import { useSyncExternalStore } from 'react';
import { decisions, getDecisionAnalytics } from '@/lib/mock-data';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

export default function AnalyticsPage() {
  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  
  const activeDecisions = decisions.filter((decision) => !decision.isPrecedent);
  const analytics = getDecisionAnalytics();

  const statusData = [
    { name: 'Incoming', value: analytics.byStatus.incoming },
    { name: 'Review', value: analytics.byStatus.in_analysis + analytics.byStatus.awaiting_review },
    { name: 'Execution', value: analytics.byStatus.with_chairman + analytics.byStatus.in_execution },
    { name: 'Completed', value: analytics.byStatus.completed },
  ];

  const trendData = [
    { day: 'Mon', decisions: 8 },
    { day: 'Tue', decisions: 12 },
    { day: 'Wed', decisions: 6 },
    { day: 'Thu', decisions: 15 },
    { day: 'Fri', decisions: 10 },
    { day: 'Sat', decisions: 3 },
    { day: 'Sun', decisions: 2 },
  ];

  const categoryData = Object.entries(
    activeDecisions.reduce<Record<string, number>>((acc, decision) => {
      const key = decision.category;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, count]) => ({ name, count }));

  const chartPrimary = 'var(--primary)';
  const chartGrid = 'var(--border)';
  const chartMuted = 'var(--muted-foreground)';

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-10">
      {/* Subtitle */}
      <div className="flex items-center justify-between">
        <p className="text-[14px] text-muted-foreground">Pipeline insights and trends</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-6 pt-6 border-t border-border">
        <div>
          <p className="text-2xl font-medium tabular-nums">{analytics.total}</p>
          <p className="text-[12px] text-muted-foreground mt-1">Total Decisions</p>
        </div>
        <div>
          <p className="text-2xl font-medium tabular-nums">18h</p>
          <p className="text-[12px] text-muted-foreground mt-1">Avg Cycle Time</p>
        </div>
        <div>
          <p className="text-2xl font-medium tabular-nums">56</p>
          <p className="text-[12px] text-muted-foreground mt-1">Weekly Throughput</p>
        </div>
        <div>
          <p className="text-2xl font-medium tabular-nums">87%</p>
          <p className="text-[12px] text-muted-foreground mt-1">AI Accuracy</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-10">
        {/* By Status */}
        <div>
          <h3 className="text-title mb-4">By Status</h3>
          <div className="h-[260px] border border-border rounded-xl p-4 bg-card/60 shadow-sm">
            {isClient && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusData} layout="vertical">
                  <CartesianGrid strokeDasharray="4 6" stroke={chartGrid} vertical={false} />
                  <XAxis type="number" stroke={chartMuted} fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis type="category" dataKey="name" stroke={chartMuted} fontSize={11} width={80} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--card)',
                      border: '1px solid var(--border)',
                      borderRadius: '6px',
                      fontSize: '12px',
                      color: 'var(--foreground)',
                    }}
                    cursor={{ fill: 'var(--accent)' }}
                  />
                  <Bar dataKey="value" fill={chartPrimary} radius={[6, 6, 6, 6]} barSize={16} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Weekly Trend */}
        <div>
          <h3 className="text-title mb-4">Weekly Trend</h3>
          <div className="h-[260px] border border-border rounded-xl p-4 bg-card/60 shadow-sm">
            {isClient && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={chartPrimary} stopOpacity={0.4} />
                      <stop offset="95%" stopColor={chartPrimary} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="4 6" stroke={chartGrid} />
                  <XAxis dataKey="day" stroke={chartMuted} fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke={chartMuted} fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--card)',
                      border: '1px solid var(--border)',
                      borderRadius: '6px',
                      fontSize: '12px',
                      color: 'var(--foreground)',
                    }}
                    cursor={{ stroke: chartPrimary, strokeDasharray: '4 6' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="decisions" 
                    stroke={chartPrimary}
                    fill="url(#trendFill)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* By Category */}
      <div>
        <h3 className="text-title mb-4">By Category</h3>
        <div className="h-[220px] border border-border rounded-xl p-4 bg-card/60 shadow-sm">
          {isClient && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="4 6" stroke={chartGrid} />
                <XAxis dataKey="name" stroke={chartMuted} fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke={chartMuted} fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: '6px',
                    fontSize: '12px',
                    color: 'var(--foreground)',
                  }}
                  cursor={{ fill: 'var(--accent)' }}
                />
                <Bar dataKey="count" fill={chartPrimary} radius={[6, 6, 6, 6]} barSize={18} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Recent Decisions Table */}
      <div>
        <h3 className="text-title mb-4">Recent Decisions</h3>
        <div className="border border-border rounded-lg overflow-hidden">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-[11px] font-medium uppercase tracking-wider px-4 py-3 text-muted-foreground">ID</th>
                <th className="text-left text-[11px] font-medium uppercase tracking-wider px-4 py-3 text-muted-foreground">Title</th>
                <th className="text-left text-[11px] font-medium uppercase tracking-wider px-4 py-3 text-muted-foreground">Category</th>
                <th className="text-right text-[11px] font-medium uppercase tracking-wider px-4 py-3 text-muted-foreground">Value</th>
                <th className="text-right text-[11px] font-medium uppercase tracking-wider px-4 py-3 text-muted-foreground">Confidence</th>
              </tr>
            </thead>
            <tbody>
              {activeDecisions.slice(0, 4).map((decision) => (
                <tr key={decision.id} className="border-b border-border last:border-0 hover:bg-secondary/50">
                  <td className="px-4 py-3 text-muted-foreground">{decision.id}</td>
                  <td className="px-4 py-3 font-medium">{decision.title}</td>
                  <td className="px-4 py-3 text-muted-foreground capitalize">{decision.category}</td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    {decision.value ? `AED ${(decision.value / 1000).toFixed(0)}K` : '—'}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">
                    {decision.aiConfidence ? `${decision.aiConfidence}%` : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
