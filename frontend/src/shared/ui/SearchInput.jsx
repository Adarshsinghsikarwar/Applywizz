export default function SearchInput({ value, onChange, placeholder = 'Search…' }) {
  return (
    <div className="relative w-full">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <svg
          className="h-4 w-4 text-ink-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-ink-200 bg-white py-2 pl-9 pr-4 text-sm text-ink-700 placeholder:text-ink-400 transition-all duration-200 hover:border-ink-300 focus:border-signal-500 focus:outline-none focus:ring-2 focus:ring-signal-500/10"
      />
    </div>
  );
}
