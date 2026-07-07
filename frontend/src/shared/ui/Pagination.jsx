import Button from './Button';

export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <div className="flex items-center justify-between gap-4 border-t border-ink-100/70 bg-white/50 px-4 py-3.5 rounded-b-xl">
      <span className="text-xs font-medium text-ink-400">
        Page <span className="font-bold text-ink-700">{page}</span> of <span className="font-bold text-ink-700">{totalPages}</span>
      </span>
      <div className="flex gap-2">
        <Button
          variant="secondary"
          disabled={!canPrev}
          onClick={() => onChange(page - 1)}
          className="!py-1.5 !px-3 text-xs flex items-center gap-1"
        >
          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
          </svg>
          Previous
        </Button>
        <Button
          variant="secondary"
          disabled={!canNext}
          onClick={() => onChange(page + 1)}
          className="!py-1.5 !px-3 text-xs flex items-center gap-1"
        >
          Next
          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
          </svg>
        </Button>
      </div>
    </div>
  );
}
