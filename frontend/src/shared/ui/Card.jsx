export default function Card({ children, className = '', as: Component = 'div', hoverEffect = false, ...rest }) {
  return (
    <Component
      className={`rounded-xl border border-ink-100/70 bg-white shadow-[0_1px_3px_rgba(16,24,40,0.05),0_1px_2px_rgba(16,24,40,0.02)] transition-all duration-300 ${
        hoverEffect ? 'hover:-translate-y-1 hover:shadow-[0_12px_16px_-4px_rgba(16,24,40,0.08),0_4px_6px_-2px_rgba(16,24,40,0.03)] hover:border-ink-200/80' : ''
      } ${className}`}
      {...rest}
    >
      {children}
    </Component>
  );
}
