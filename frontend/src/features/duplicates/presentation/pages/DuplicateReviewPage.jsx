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
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex items-start justify-between gap-4 border-b border-ink-100 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink-900">Duplicate Review Console</h1>
          <p className="text-sm text-ink-500">
            Audit grouped postings flagged by duplicate URL matches, exact textual content, or vector similarity.
          </p>
        </div>
        <Button
          variant="secondary"
          onClick={runDetection}
          disabled={detecting}
          className="flex items-center gap-1.5 !px-3.5 !py-2 text-xs font-bold uppercase tracking-wider shadow-sm"
        >
          {detecting ? (
            <>
              <svg className="h-3.5 w-3.5 animate-spin text-ink-400" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Re-running…
            </>
          ) : (
            'Re-run detection'
          )}
        </Button>
      </div>

      {/* Pill Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold uppercase tracking-wider text-ink-400 mr-2">
          Filter Review:
        </span>
        <button
          onClick={() => setStatus(null)}
          className={`rounded-lg border px-3.5 py-1.5 text-xs font-bold transition-all duration-200 ${
            !status
              ? 'border-signal-500/20 bg-signal-50 text-signal-600 shadow-sm'
              : 'border-ink-200/60 bg-white text-ink-600 hover:border-ink-300 hover:text-ink-800'
          }`}
        >
          All Groups
        </button>
        {REVIEW_STATUS_OPTIONS.map((opt) => (
          <button
            key={opt}
            onClick={() => setStatus(opt)}
            className={`rounded-lg border px-3.5 py-1.5 text-xs font-bold transition-all duration-200 ${
              status === opt
                ? 'border-signal-500/20 bg-signal-50 text-signal-600 shadow-sm'
                : 'border-ink-200/60 bg-white text-ink-600 hover:border-ink-300 hover:text-ink-800'
            }`}
          >
            {reviewStatusLabel(opt)}
          </button>
        ))}
      </div>

      {/* Loading, Error or Content states */}
      {loading && <Loader label="Evaluating group parameters and review states…" />}
      {error && <ErrorState message={error.message} onRetry={retry} />}
      {!loading && !error && groups.length === 0 && (
        <EmptyState
          title="No duplicate groups found"
          description="Either there are no flagged duplicate groups matching this filter, or duplicate detection has not been completed."
        />
      )}

      {!loading && !error && groups.length > 0 && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4">
            {groups.map((group) => (
              <DuplicateGroupCard key={group.duplicateGroupId} group={group} onReview={reviewJob} />
            ))}
          </div>
          <div className="mt-2">
            <Pagination page={page} totalPages={pagination.totalPages} onChange={setPage} />
          </div>
        </div>
      )}
    </div>
  );
}
