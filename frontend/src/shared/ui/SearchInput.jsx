export default function SearchInput({ value, onChange, placeholder = 'Search…' }) {
  return (
    <input
      type="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-md border border-ink-200 bg-white px-3 py-2 text-sm text-ink-700 placeholder:text-ink-300 focus:border-signal-400"
    />
  );
}
