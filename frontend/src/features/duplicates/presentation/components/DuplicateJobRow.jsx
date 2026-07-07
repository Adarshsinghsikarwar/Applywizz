import { Link } from 'react-router-dom';
import Badge from '../../../../shared/ui/Badge';
import { formatLocation } from '../../../jobs/domain/job.entity';
import { formatRelativeDate } from '../../../../shared/utils/formatters';
import {
  REVIEW_STATUS_OPTIONS,
  reviewStatusLabel,
  reviewStatusVariant,
} from '../../domain/duplicate.entity';

export default function DuplicateJobRow({ job, onReview }) {
  return (
    <div className="flex flex-wrap items-center gap-3 border-t border-ink-100 px-4 py-3 first:border-t-0">
      <div className="min-w-[220px] flex-1">
        <Link to={`/jobs/${job._id}`} className="text-sm font-medium text-ink-800 hover:text-signal-500">
          {job.title}
        </Link>
        <p className="text-xs text-ink-400">
          {job.company} · {formatLocation(job.location)} · {formatRelativeDate(job.datePosted?.parsed)}
        </p>
      </div>

      {job.isPrimaryInGroup ? (
        <Badge variant="signal">Primary</Badge>
      ) : (
        <Badge variant={reviewStatusVariant(job.duplicateReviewStatus)}>
          {reviewStatusLabel(job.duplicateReviewStatus)}
        </Badge>
      )}

      {!job.isPrimaryInGroup && (
        <select
          value={job.duplicateReviewStatus}
          onChange={(e) => onReview(job._id, e.target.value)}
          className="rounded-md border border-ink-200 bg-white px-2 py-1 text-xs text-ink-700 focus:border-signal-400"
        >
          {REVIEW_STATUS_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {reviewStatusLabel(opt)}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
