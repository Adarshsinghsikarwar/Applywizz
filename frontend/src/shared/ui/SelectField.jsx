export default function SelectField({ label, value, onChange, options, placeholder = 'All' }) {
  return (
    <label className="flex flex-col gap-1.5 text-xs font-semibold tracking-wider text-ink-500 uppercase">
      {label}
      <div className="relative">
        <select
          value={value || ''}
          onChange={(e) => onChange(e.target.value || null)}
          className="w-full cursor-pointer appearance-none rounded-lg border border-ink-200 bg-white py-2 pl-3 pr-8 text-sm font-medium text-ink-700 transition-all duration-200 hover:border-ink-300 focus:border-signal-500 focus:outline-none focus:ring-2 focus:ring-signal-500/10"
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <svg className="h-4 w-4 text-ink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </label>
  );
}
