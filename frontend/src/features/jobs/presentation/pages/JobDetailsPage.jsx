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
    <div className="flex flex-col gap-6">
      {/* Back to search link */}
      <div>
        <Link
          to="/jobs"
          className="inline-flex items-center gap-1 text-xs font-semibold text-signal-500 hover:text-signal-600 transition-colors group"
        >
          <svg className="h-3 w-3 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to postings
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Details Panel (Left Column) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Card className="p-6">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-ink-100 pb-5">
              <div className="min-w-0 flex-1">
                <h1 className="text-2xl font-bold tracking-tight text-ink-900">{job.title}</h1>
                <p className="mt-1.5 text-base font-semibold text-signal-600">{job.company}</p>
              </div>
              <div className="flex flex-wrap gap-1.5 items-center">
                {job.isDuplicate && <Badge variant="alert">Duplicate</Badge>}
                {isDataIncomplete(job) && <Badge variant="neutral">Incomplete Data</Badge>}
              </div>
            </div>

            {/* Highlights chips */}
            <div className="mt-5 flex flex-wrap gap-2">
              {jobHighlights(job).map((h) => (
                <Badge key={h.key} variant={h.variant} className="!px-3 !py-1 uppercase font-bold tracking-wider">
                  {h.label}
                </Badge>
              ))}
            </div>

            {/* Description Html Block */}
            {job.description?.html && (
              <div className="mt-6">
                <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-ink-500">
                  Description
                </h2>
                {/* description.html is sanitized server-side (sanitize-html) before storage — safe to render */}
                <div
                  className="prose prose-sm max-w-none text-ink-700 leading-relaxed space-y-4"
                  dangerouslySetInnerHTML={{ __html: job.description.html }}
                />
              </div>
            )}
          </Card>
        </div>

        {/* Info Sidebar (Right Column) */}
        <div className="flex flex-col gap-6">
          <Card className="p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-signal-400 to-signal-600" />
            
            <h3 className="mb-5 text-sm font-bold uppercase tracking-wider text-ink-700">
              Posting Metadata
            </h3>

            <dl className="space-y-5">
              <div>
                <dt className="text-[10px] font-bold uppercase tracking-wider text-ink-400">Salary Package</dt>
                <dd className="mt-1 font-mono text-base font-bold text-ink-950">{formatSalary(job.salary)}</dd>
              </div>

              <div className="border-t border-ink-100/60 pt-4">
                <dt className="text-[10px] font-bold uppercase tracking-wider text-ink-400">Office Location</dt>
                <dd className="mt-1 text-sm font-semibold text-ink-700">{formatLocation(job.location)}</dd>
              </div>

              <div className="border-t border-ink-100/60 pt-4">
                <dt className="text-[10px] font-bold uppercase tracking-wider text-ink-400">Date Posted</dt>
                <dd className="mt-1 text-sm font-semibold text-ink-700">{formatRelativeDate(job.datePosted?.parsed)}</dd>
              </div>

              {job.department && (
                <div className="border-t border-ink-100/60 pt-4">
                  <dt className="text-[10px] font-bold uppercase tracking-wider text-ink-400">Department</dt>
                  <dd className="mt-1 text-sm font-semibold text-ink-700">{job.department}</dd>
                </div>
              )}

              {job.applyType && (
                <div className="border-t border-ink-100/60 pt-4">
                  <dt className="text-[10px] font-bold uppercase tracking-wider text-ink-400">Apply Method</dt>
                  <dd className="mt-1 text-sm font-semibold text-ink-700">{job.applyType}</dd>
                </div>
              )}
            </dl>

            {job.url && (
              <div className="mt-6 border-t border-ink-100 pt-5">
                <Button
                  as="a"
                  href={job.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="primary"
                  className="w-full text-center py-2.5 text-xs tracking-wide uppercase font-bold"
                >
                  Apply Externally ↗
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
