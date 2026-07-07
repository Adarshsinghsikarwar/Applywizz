import { useParams, Link } from 'react-router-dom';
import { useJobDetails } from '../../application/useJobDetails';
import Card from '../../../../shared/ui/Card';
import Badge from '../../../../shared/ui/Badge';
import Loader from '../../../../shared/ui/Loader';
import ErrorState from '../../../../shared/ui/ErrorState';
import Button from '../../../../shared/ui/Button';
import { formatRelativeDate } from '../../../../shared/utils/formatters';
import { formatLocation, formatSalary, jobHighlights, isDataIncomplete } from '../../domain/job.entity';

export default function JobDetailsPage() {
  const { id } = useParams();
  const { job, loading, error, retry } = useJobDetails(id);

  if (loading) return <Loader label="Loading job details…" />;
  if (error) return <ErrorState message={error.message} onRetry={retry} />;
  if (!job) return null;

  return (
    <div className="flex flex-col gap-4">
      <Link to="/jobs" className="text-xs font-medium text-signal-500 hover:underline">
        ← Back to search
      </Link>

      <Card className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold text-ink-800">{job.title}</h1>
            <p className="mt-1 text-sm text-ink-500">{job.company}</p>
          </div>
          <div className="flex flex-col items-end gap-1">
            {job.isDuplicate && <Badge variant="alert">Flagged as duplicate</Badge>}
            {isDataIncomplete(job) && <Badge variant="neutral">Incomplete source data</Badge>}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {jobHighlights(job).map((h) => (
            <Badge key={h.key} variant={h.variant}>
              {h.label}
            </Badge>
          ))}
        </div>

        <dl className="mt-6 grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-xs text-ink-400">Location</dt>
            <dd className="text-ink-700">{formatLocation(job.location)}</dd>
          </div>
          <div>
            <dt className="text-xs text-ink-400">Posted</dt>
            <dd className="text-ink-700">{formatRelativeDate(job.datePosted?.parsed)}</dd>
          </div>
          <div>
            <dt className="text-xs text-ink-400">Salary</dt>
            <dd className="text-ink-700">{formatSalary(job.salary)}</dd>
          </div>
          <div>
            <dt className="text-xs text-ink-400">Department</dt>
            <dd className="text-ink-700">{job.department}</dd>
          </div>
          <div>
            <dt className="text-xs text-ink-400">Apply type</dt>
            <dd className="text-ink-700">{job.applyType}</dd>
          </div>
        </dl>

        {job.description?.html && (
          <div className="mt-6 border-t border-ink-100 pt-4">
            <h2 className="mb-2 text-sm font-semibold text-ink-700">Description</h2>
            {/* description.html is sanitized server-side (sanitize-html) before storage — safe to render */}
            <div
              className="prose prose-sm max-w-none text-ink-600"
              dangerouslySetInnerHTML={{ __html: job.description.html }}
            />
          </div>
        )}

        {job.url && (
          <div className="mt-6 border-t border-ink-100 pt-4">
            <Button as="a" href={job.url} target="_blank" rel="noopener noreferrer" variant="secondary">
              View original posting ↗
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
