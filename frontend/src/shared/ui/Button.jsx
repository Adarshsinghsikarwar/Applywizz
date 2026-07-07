const VARIANT_CLASSES = {
  primary: 'bg-signal-500 text-white hover:bg-signal-600 disabled:bg-ink-200',
  secondary: 'bg-white text-ink-700 border border-ink-200 hover:bg-ink-50 disabled:text-ink-300',
  ghost: 'text-ink-600 hover:bg-ink-100 disabled:text-ink-300',
  danger: 'bg-white text-alert-500 border border-alert-100 hover:bg-alert-100 disabled:text-ink-300',
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
      className={`inline-flex items-center justify-center gap-1.5 rounded-md px-3.5 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed ${VARIANT_CLASSES[variant] || VARIANT_CLASSES.primary} ${className}`}
      {...typeProp}
      {...rest}
    >
      {children}
    </Component>
  );
}
