export default function Loader({ label = 'Loading…', className = '' }) {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 py-16 text-sm text-ink-500 ${className}`} role="status">
      <div className="relative flex h-10 w-10 items-center justify-center">
        {/* Outer glowing ring */}
        <span className="absolute h-full w-full animate-ping rounded-full bg-signal-400/20 opacity-75" />
        {/* Inner spinner */}
        <span className="h-8 w-8 animate-spin rounded-full border-3 border-ink-100 border-t-signal-500 shadow-inner" />
      </div>
      <span className="font-medium tracking-wide text-ink-500 animate-pulse">{label}</span>
    </div>
  );
}
