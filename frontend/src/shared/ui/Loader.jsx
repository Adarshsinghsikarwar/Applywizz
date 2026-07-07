export default function Loader({ label = 'Loading…', className = '' }) {
  return (
    <div className={`flex items-center gap-2 py-8 text-sm text-ink-400 ${className}`} role="status">
      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-ink-200 border-t-signal-500" />
      {label}
    </div>
  );
}
