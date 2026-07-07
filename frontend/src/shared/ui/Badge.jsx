const VARIANT_CLASSES = {
  neutral: 'bg-ink-50 text-ink-600 border border-ink-200/50',
  signal: 'bg-signal-50 text-signal-600 border border-signal-200/50',
  alert: 'bg-alert-100/30 text-alert-500 border border-alert-100',
};

export default function Badge({ children, variant = 'neutral', className = '' }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide ${VARIANT_CLASSES[variant] || VARIANT_CLASSES.neutral} ${className}`}
    >
      {children}
    </span>
  );
}
