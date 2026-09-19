import {
  getDashboardMetrics,
  getRecentExceptions,
  getRecentProjects,
  getTodayReminders
} from '@/lib/queries/dashboard';
import { KpiCard } from './kpi-card';
import { StageDistribution, HealthDistribution } from './charts';
import { ExceptionsFeed } from './exceptions-feed';
import { ProjectsTable } from './projects-table';
import { RemindersPanel } from './reminders-panel';
import { formatMoney, pct, timeAgo } from '@/lib/format';
import {
  Building2, AlertTriangle, TrendingUp, ScrollText,
  Bell, FileText, Target, Banknote
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const [metrics, exceptions, projects, reminders] = await Promise.all([
    getDashboardMetrics(),
    getRecentExceptions(5),
    getRecentProjects(6),
    getTodayReminders(4)
  ]);

  const syncLabel = metrics.lastSync ? timeAgo(metrics.lastSync) : 'never';

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Owner Command Center</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Portfolio health as of {new Date().toLocaleString('en-GB', {
              day: '2-digit', month: 'short', year: 'numeric',
              hour: '2-digit', minute: '2-digit'
            })} UTC
          </p>
        </div>
        <span className="text-[10px] font-mono text-muted-foreground">
          recomputeProjectState() ran {syncLabel}
        </span>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard
          icon={Building2}
          label="Total Active Project Value"
          value={formatMoney(metrics.totalContractValue, 'INR')}
          sub={`Across ${metrics.activeProjects} active projects`}
          accent
          className="lg:col-span-2"
        />
        <KpiCard
          icon={AlertTriangle}
          label="Projects at Risk / Critical"
          value={`${metrics.atRisk} / ${metrics.critical}`}
          sub={`${metrics.atRisk + metrics.critical} of ${metrics.totalProjects} need intervention`}
        />
        <KpiCard
          icon={TrendingUp}
          label="Collection Efficiency"
          value={pct(metrics.collectionEfficiency)}
          sub={`${formatMoney(metrics.totalCollected, 'INR')} collected of ${formatMoney(metrics.totalBilled, 'INR')} billed`}
        />
        <KpiCard
          icon={ScrollText}
          label="Unresolved Exceptions"
          value={String(metrics.openExceptions)}
          sub={`${metrics.criticalExceptions} critical · ${metrics.highExceptions} high · ${metrics.mediumExceptions} medium`}
        />
        <KpiCard
          icon={Bell}
          label="Overdue Reminders"
          value={String(metrics.overdueReminders)}
          sub={metrics.overdueReminders === 0 ? 'All clear' : 'Past due'}
        />
        <KpiCard
          icon={FileText}
          label="Billed to Date"
          value={formatMoney(metrics.totalBilled, 'INR')}
          sub={metrics.totalBilled === 0 ? 'No invoices raised yet' : `${((metrics.totalBilled / Math.max(metrics.totalContractValue, 1)) * 100).toFixed(1)}% of contract`}
        />
        <KpiCard
          icon={Target}
          label="Avg Execution Progress"
          value={pct(metrics.avgExecutionProgress)}
          sub="Weighted across execution-stage projects"
        />
        <KpiCard
          icon={Banknote}
          label="Unbilled Revenue"
          value={formatMoney(metrics.totalUnbilled, 'INR')}
          sub="Billed but not yet collected"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="lg:col-span-2">
          <StageDistribution data={metrics.stageDistribution} />
        </div>
        <HealthDistribution
          onTrack={metrics.onTrack}
          atRisk={metrics.atRisk}
          critical={metrics.critical}
          onHold={metrics.onHold}
        />
      </div>

      {/* Feeds Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ExceptionsFeed rows={exceptions as any} />
        <ProjectsTable rows={projects as any} />
        <RemindersPanel rows={reminders as any} />
      </div>
    </div>
  );
}
