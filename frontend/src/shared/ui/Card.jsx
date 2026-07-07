export default function Card({ children, className = '', as: Component = 'div', ...rest }) {
  return (
    <Component
      className={`rounded-lg border border-ink-100 bg-white shadow-sm ${className}`}
      {...rest}
    >
      {children}
    </Component>
  );
}
