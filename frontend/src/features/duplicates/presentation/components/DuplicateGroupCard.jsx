import Card from '../../../../shared/ui/Card';
import Badge from '../../../../shared/ui/Badge';
import { duplicateTypeLabel } from '../../domain/duplicate.entity';
import DuplicateJobRow from './DuplicateJobRow';

export default function DuplicateGroupCard({ group, onReview }) {
  const dominantType = group.jobs.find((j) => j.duplicateType)?.duplicateType;

  return (
    <Card hoverEffect className="overflow-hidden border border-ink-100/70">
      {/* Header element */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-ink-50/60 px-5 py-3 border-b border-ink-100/60">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-ink-600">
          <span className="h-1.5 w-1.5 rounded-full bg-ink-400" />
          {group.jobs.length} duplicate postings grouped
        </span>
        <Badge variant="neutral" className="!text-[10px] uppercase font-bold tracking-wider">
          {duplicateTypeLabel(dominantType)}
        </Badge>
      </div>
      
      {/* Rows Container */}
      <div className="divide-y divide-ink-100/50">
        {group.jobs.map((job) => (
          <DuplicateJobRow key={job._id} job={job} onReview={onReview} />
        ))}
      </div>
    </Card>
  );
}
