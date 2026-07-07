import { Link } from 'react-router-dom';
import Card from '../../../../shared/ui/Card';
import Badge from '../../../../shared/ui/Badge';
import { formatRelativeDate } from '../../../../shared/utils/formatters';
import { formatLocation, formatSalary, jobHighlights, isDataIncomplete } from '../../domain/job.entity';

const getCompanyAvatarColor = (name) => {
  const COLORS = [
    'bg-emerald-50 text-emerald-700 border-emerald-100/50',
    'bg-indigo-50 text-indigo-700 border-indigo-100/50',
    'bg-violet-50 text-violet-700 border-violet-100/50',
    'bg-amber-50 text-amber-700 border-amber-100/50',
    'bg-sky-50 text-sky-700 border-sky-100/50',
    'bg-rose-50 text-rose-700 border-rose-100/50',
  ];
  if (!name) return COLORS[0];
  let sum = 0;
  for (let i = 0; i < name.length; i++) {
    sum += name.charCodeAt(i);
  }
  return COLORS[sum % COLORS.length];
};

const getCompanyInitials = (name) => {
  if (!name) return '??';
  const cleanName = name.replace(/[^a-zA-Z0-9\s]/g, '').trim();
  const words = cleanName.split(/\s+/).filter(Boolean);
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }
  return '??';
};

export default function JobCard({ job }) {
  const avatarClass = getCompanyAvatarColor(job.company);
  const initials = getCompanyInitials(job.company);

  return (
    <Card
      as={Link}
      to={`/jobs/${job._id}`}
      hoverEffect
      className="block p-5 border border-ink-100/70 hover:border-signal-500/30"
    >
      <div className="flex items-start gap-4">
        {/* Company Initials Avatar */}
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border text-sm font-bold ${avatarClass}`}>
          {initials}
        </div>

        {/* Card Body */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <h3 className="truncate text-base font-bold text-ink-800 transition-colors group-hover:text-signal-500">
              {job.title}
            </h3>
            
            {/* Status Badges */}
            <div className="flex shrink-0 flex-col items-end gap-1">
              {job.isDuplicate && <Badge variant="alert">Duplicate</Badge>}
              {isDataIncomplete(job) && <Badge variant="neutral">Incomplete</Badge>}
            </div>
          </div>

          <p className="mt-0.5 text-sm font-medium text-ink-500">{job.company}</p>

          {/* Highlights (Chips) */}
          <div className="mt-3.5 flex flex-wrap gap-1.5">
            {jobHighlights(job).map((h) => (
              <Badge key={h.key} variant={h.variant} className="!py-0.5 !text-[10px] uppercase font-bold">
                {h.label}
              </Badge>
            ))}
          </div>

          {/* Divider */}
          <div className="my-4 border-t border-ink-100/60" />

          {/* Footer Metadata */}
          <div className="flex items-center justify-between text-xs text-ink-400">
            <div className="flex items-center gap-1">
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{formatLocation(job.location)}</span>
            </div>
            <span>{formatRelativeDate(job.datePosted?.parsed)}</span>
          </div>

          <div className="mt-3.5 font-mono text-sm font-bold text-signal-600">
            {formatSalary(job.salary)}
          </div>
        </div>
      </div>
    </Card>
  );
}
