const VARIANT_CLASSES = {
  primary: 'bg-gradient-to-r from-signal-500 to-signal-600 text-white shadow-sm shadow-signal-500/15 hover:from-signal-600 hover:to-signal-600 hover:shadow-md hover:shadow-signal-500/20 active:scale-95 disabled:from-ink-200 disabled:to-ink-200 disabled:shadow-none',
  secondary: 'bg-white text-ink-700 border border-ink-200 hover:border-ink-300 hover:bg-ink-50 shadow-sm hover:shadow active:scale-95 disabled:text-ink-300 disabled:border-ink-100 disabled:bg-ink-50',
  ghost: 'text-ink-600 hover:bg-ink-100/70 hover:text-ink-800 active:scale-95 disabled:text-ink-300',
  danger: 'bg-white text-alert-500 border border-alert-100 hover:bg-alert-100/50 hover:border-alert-500/30 active:scale-95 disabled:text-ink-300',
};

export default function Button({
  children,
  variant = 'primary',
  className = '',
  type = 'button',
  as: Component = 'button',
  ...rest
}) {
  const typeProp = Component === 'button' ? { type } : {};
  return (
    <Component
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold tracking-wide transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-signal-500/20 disabled:cursor-not-allowed ${VARIANT_CLASSES[variant] || VARIANT_CLASSES.primary} ${className}`}
      {...typeProp}
      {...rest}
    >
      {children}
    </Component>
  );
}
