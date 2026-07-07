import { useDashboardMetrics } from '../../application/useDashboardMetrics';
import { shapeBreakdown, shapeTrend } from '../../domain/metrics.entity';
import Loader from '../../../../shared/ui/Loader';
import ErrorState from '../../../../shared/ui/ErrorState';
import MetricCard from '../components/MetricCard';
import BreakdownChart from '../components/BreakdownChart';
import TrendChart from '../components/TrendChart';

export default function DashboardPage() {
  const { metrics, loading, error, retry } = useDashboardMetrics();

  if (loading) return <Loader label="Crunching the numbers…" />;
  if (error) return <ErrorState message={error.message} onRetry={retry} />;
  if (!metrics) return null;

  const { totals, breakdowns, postingsTrend, topCompanies } = metrics;

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col gap-1 border-b border-ink-100 pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-ink-900">Console Analytics</h1>
        <p className="text-sm text-ink-500">
          Key metrics and distributional insights across the full job dataset.
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <MetricCard label="Total postings" value={totals.totalJobs} />
        <MetricCard label="Unique companies" value={totals.totalCompanies} />
        <MetricCard
          label="Duplicate postings"
          value={totals.totalDuplicateJobs}
          hint={`${totals.duplicateRate}% redundancy rate`}
        />
        <MetricCard
          label="Top employer"
          value={topCompanies?.[0]?.count || 0}
          hint={topCompanies?.[0]?._id || 'N/A'}
        />
      </div>

      {/* Charts section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <BreakdownChart title="Postings by department" data={shapeBreakdown(breakdowns.byDepartment)} />
        <BreakdownChart title="Postings by employment type" data={shapeBreakdown(breakdowns.byEmploymentType)} />
        <BreakdownChart title="Postings by experience level" data={shapeBreakdown(breakdowns.byExperienceLevel)} />
        <BreakdownChart title="Postings by work mode" data={shapeBreakdown(breakdowns.byRemoteFlag)} />
      </div>

      <div className="mt-2">
        <TrendChart data={shapeTrend(postingsTrend)} />
      </div>
    </div>
  );
}
