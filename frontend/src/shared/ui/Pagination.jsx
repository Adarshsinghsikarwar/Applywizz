import Button from './Button';

export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <div className="flex items-center justify-between gap-4 border-t border-ink-100 px-4 py-3">
      <span className="text-xs text-ink-400">
        Page <span className="font-medium text-ink-600">{page}</span> of {totalPages}
      </span>
      <div className="flex gap-2">
        <Button variant="secondary" disabled={!canPrev} onClick={() => onChange(page - 1)}>
          Previous
        </Button>
        <Button variant="secondary" disabled={!canNext} onClick={() => onChange(page + 1)}>
          Next
        </Button>
      </div>
    </div>
  );
}
