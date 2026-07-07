import Loader from '../../../../shared/ui/Loader';
import ErrorState from '../../../../shared/ui/ErrorState';
import EmptyState from '../../../../shared/ui/EmptyState';
import Pagination from '../../../../shared/ui/Pagination';
import JobCard from './JobCard';

export default function JobList({ jobs, loading, error, retry, pagination, page, setPage }) {
  if (loading) return <Loader label="Scanning database for matching postings…" />;
  if (error) return <ErrorState message={error.message} onRetry={retry} />;
  if (jobs.length === 0) {
    return (
      <EmptyState
        title="No postings match these filters"
        description="Try widening your search keywords or clearing the active filters."
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-ink-100 px-3 py-1 text-xs font-semibold text-ink-600">
          <span className="h-1.5 w-1.5 rounded-full bg-signal-500" />
          {pagination.total} active postings found
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {jobs.map((job) => (
          <JobCard key={job._id} job={job} />
        ))}
      </div>

      <div className="mt-2">
        <Pagination page={page} totalPages={pagination.totalPages} onChange={setPage} />
      </div>
    </div>
  );
}
