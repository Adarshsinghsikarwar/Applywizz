import Loader from '../../../../shared/ui/Loader';
import ErrorState from '../../../../shared/ui/ErrorState';
import EmptyState from '../../../../shared/ui/EmptyState';
import Pagination from '../../../../shared/ui/Pagination';
import JobCard from './JobCard';

export default function JobList({ jobs, loading, error, retry, pagination, page, setPage }) {
  if (loading) return <Loader label="Searching jobs…" />;
  if (error) return <ErrorState message={error.message} onRetry={retry} />;
  if (jobs.length === 0) {
    return (
      <EmptyState
        title="No jobs match these filters"
        description="Try widening your search or clearing a filter."
      />
    );
  }

  return (
    <div>
      <p className="mb-3 text-xs text-ink-400">{pagination.total} jobs found</p>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        {jobs.map((job) => (
          <JobCard key={job._id} job={job} />
        ))}
      </div>
      <Pagination page={page} totalPages={pagination.totalPages} onChange={setPage} />
    </div>
  );
}
