import { useDuplicateGroups } from '../../application/useDuplicateGroups';
import { REVIEW_STATUS_OPTIONS, reviewStatusLabel } from '../../domain/duplicate.entity';
import Loader from '../../../../shared/ui/Loader';
import ErrorState from '../../../../shared/ui/ErrorState';
import EmptyState from '../../../../shared/ui/EmptyState';
import Pagination from '../../../../shared/ui/Pagination';
import Button from '../../../../shared/ui/Button';
import DuplicateGroupCard from '../components/DuplicateGroupCard';

export default function DuplicateReviewPage() {
  const {
    groups,
    pagination,
    status,
    setStatus,
    page,
    setPage,
    loading,
    error,
    retry,
    reviewJob,
    runDetection,
    detecting,
  } = useDuplicateGroups();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold text-ink-800">Duplicate review</h1>
          <p className="text-sm text-ink-400">
            Grouped postings flagged by URL match, exact content match, or near-duplicate similarity.
          </p>
        </div>
        <Button variant="secondary" onClick={runDetection} disabled={detecting}>
          {detecting ? 'Re-running…' : 'Re-run detection'}
        </Button>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setStatus(null)}
          className={`rounded-full px-3 py-1 text-xs font-medium ${!status ? 'bg-signal-500 text-white' : 'bg-ink-100 text-ink-500'}`}
        >
          All
        </button>
        {REVIEW_STATUS_OPTIONS.map((opt) => (
          <button
            key={opt}
            onClick={() => setStatus(opt)}
            className={`rounded-full px-3 py-1 text-xs font-medium ${status === opt ? 'bg-signal-500 text-white' : 'bg-ink-100 text-ink-500'}`}
          >
            {reviewStatusLabel(opt)}
          </button>
        ))}
      </div>

      {loading && <Loader label="Loading duplicate groups…" />}
      {error && <ErrorState message={error.message} onRetry={retry} />}
      {!loading && !error && groups.length === 0 && (
        <EmptyState
          title="No duplicate groups found"
          description="Either there are none for this filter, or detection hasn't been run yet."
        />
      )}

      {!loading && !error && groups.length > 0 && (
        <div className="flex flex-col gap-3">
          {groups.map((group) => (
            <DuplicateGroupCard key={group.duplicateGroupId} group={group} onReview={reviewJob} />
          ))}
          <Pagination page={page} totalPages={pagination.totalPages} onChange={setPage} />
        </div>
      )}
    </div>
  );
}
