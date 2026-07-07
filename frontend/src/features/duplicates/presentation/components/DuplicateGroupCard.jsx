import Card from '../../../../shared/ui/Card';
import Badge from '../../../../shared/ui/Badge';
import { duplicateTypeLabel } from '../../domain/duplicate.entity';
import DuplicateJobRow from './DuplicateJobRow';

export default function DuplicateGroupCard({ group, onReview }) {
  const dominantType = group.jobs.find((j) => j.duplicateType)?.duplicateType;

  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between bg-ink-50 px-4 py-2">
        <span className="text-xs font-medium text-ink-500">
          {group.jobs.length} postings in this group
        </span>
        <Badge variant="neutral">{duplicateTypeLabel(dominantType)}</Badge>
      </div>
      <div>
        {group.jobs.map((job) => (
          <DuplicateJobRow key={job._id} job={job} onReview={onReview} />
        ))}
      </div>
    </Card>
  );
}
