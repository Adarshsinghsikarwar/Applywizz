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
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-lg font-semibold text-ink-800">Dashboard</h1>
        <p className="text-sm text-ink-400">Key metrics across the full job dataset.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <MetricCard label="Total jobs" value={totals.totalJobs} />
        <MetricCard label="Companies" value={totals.totalCompanies} />
        <MetricCard
          label="Duplicate jobs"
          value={totals.totalDuplicateJobs}
          hint={`${totals.duplicateRate}% of all jobs`}
        />
        <MetricCard label="Top company" value={topCompanies?.[0]?.count} hint={topCompanies?.[0]?._id} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <BreakdownChart title="Jobs by department" data={shapeBreakdown(breakdowns.byDepartment)} />
        <BreakdownChart title="Jobs by employment type" data={shapeBreakdown(breakdowns.byEmploymentType)} />
        <BreakdownChart title="Jobs by experience level" data={shapeBreakdown(breakdowns.byExperienceLevel)} />
        <BreakdownChart title="Jobs by work mode" data={shapeBreakdown(breakdowns.byRemoteFlag)} />
      </div>

      <TrendChart data={shapeTrend(postingsTrend)} />
    </div>
  );
}
