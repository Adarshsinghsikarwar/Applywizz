import { Link } from 'react-router-dom';
import Card from '../../../../shared/ui/Card';
import Badge from '../../../../shared/ui/Badge';
import { formatRelativeDate } from '../../../../shared/utils/formatters';
import { formatLocation, formatSalary, jobHighlights, isDataIncomplete } from '../../domain/job.entity';

export default function JobCard({ job }) {
  return (
    <Card as={Link} to={`/jobs/${job._id}`} className="block p-4 transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-ink-800">{job.title}</h3>
          <p className="mt-0.5 text-sm text-ink-500">{job.company}</p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          {job.isDuplicate && <Badge variant="alert">Duplicate</Badge>}
          {isDataIncomplete(job) && <Badge variant="neutral">Incomplete data</Badge>}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {jobHighlights(job).map((h) => (
          <Badge key={h.key} variant={h.variant}>
            {h.label}
          </Badge>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-ink-400">
        <span>{formatLocation(job.location)}</span>
        <span>{formatRelativeDate(job.datePosted?.parsed)}</span>
      </div>

      <div className="mt-2 text-xs font-medium text-ink-600">{formatSalary(job.salary)}</div>
    </Card>
  );
}
