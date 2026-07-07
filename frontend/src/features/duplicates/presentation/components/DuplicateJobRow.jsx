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
    <div className="flex flex-wrap items-center justify-between gap-4 border-t border-ink-100/60 px-5 py-3.5 first:border-t-0 transition-colors hover:bg-ink-50/40">
      {/* Title & Metadata */}
      <div className="min-w-[220px] flex-1">
        <Link
          to={`/jobs/${job._id}`}
          className="text-sm font-bold text-ink-800 hover:text-signal-500 transition-colors"
        >
          {job.title}
        </Link>
        <p className="mt-0.5 text-xs text-ink-400 font-medium">
          {job.company} · <span className="text-ink-500">{formatLocation(job.location)}</span> · {formatRelativeDate(job.datePosted?.parsed)}
        </p>
      </div>

      {/* Primary Badge or Review Status Badge */}
      <div className="flex items-center gap-3">
        {job.isPrimaryInGroup ? (
          <Badge variant="signal" className="!px-2.5 !py-0.5 uppercase tracking-wider !text-[9px] font-extrabold">
            Primary Posting
          </Badge>
        ) : (
          <Badge
            variant={reviewStatusVariant(job.duplicateReviewStatus)}
            className="!px-2.5 !py-0.5 uppercase tracking-wider !text-[9px] font-extrabold"
          >
            {reviewStatusLabel(job.duplicateReviewStatus)}
          </Badge>
        )}

        {/* Dropdown Action for duplicates */}
        {!job.isPrimaryInGroup && (
          <div className="relative">
            <select
              value={job.duplicateReviewStatus}
              onChange={(e) => onReview(job._id, e.target.value)}
              className="cursor-pointer appearance-none rounded-lg border border-ink-200 bg-white py-1.5 pl-3 pr-8 text-xs font-semibold text-ink-700 transition-colors hover:border-ink-300 focus:border-signal-500 focus:outline-none focus:ring-2 focus:ring-signal-500/10"
            >
              {REVIEW_STATUS_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {reviewStatusLabel(opt)}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5">
              <svg className="h-3 w-3 text-ink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
