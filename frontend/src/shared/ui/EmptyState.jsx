export default function EmptyState({ title = 'Nothing here yet', description, action }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-ink-200 px-6 py-14 text-center">
      <p className="text-sm font-semibold text-ink-600">{title}</p>
      {description && <p className="max-w-sm text-sm text-ink-400">{description}</p>}
      {action}
    </div>
  );
}
