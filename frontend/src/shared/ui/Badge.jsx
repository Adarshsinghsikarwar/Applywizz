const VARIANT_CLASSES = {
  neutral: 'bg-ink-100 text-ink-600',
  signal: 'bg-signal-100 text-signal-600',
  alert: 'bg-alert-100 text-alert-500',
};

export default function Badge({ children, variant = 'neutral', className = '' }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${VARIANT_CLASSES[variant] || VARIANT_CLASSES.neutral} ${className}`}
    >
      {children}
    </span>
  );
}
