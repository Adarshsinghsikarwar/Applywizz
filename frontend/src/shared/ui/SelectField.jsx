export default function SelectField({ label, value, onChange, options, placeholder = 'All' }) {
  return (
    <label className="flex flex-col gap-1 text-xs font-medium text-ink-500">
      {label}
      <select
        value={value || ''}
        onChange={(e) => onChange(e.target.value || null)}
        className="rounded-md border border-ink-200 bg-white px-2.5 py-1.5 text-sm text-ink-700 focus:border-signal-400"
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </label>
  );
}
