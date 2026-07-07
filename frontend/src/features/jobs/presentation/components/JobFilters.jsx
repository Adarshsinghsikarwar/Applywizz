import SearchInput from '../../../../shared/ui/SearchInput';
import SelectField from '../../../../shared/ui/SelectField';
import Button from '../../../../shared/ui/Button';

export default function JobFilters({ filters, setFilter, resetFilters, filterOptions }) {
  return (
    <div className="flex flex-wrap items-end gap-3 rounded-lg border border-ink-100 bg-white p-4">
      <div className="min-w-[220px] flex-1">
        <label className="mb-1 block text-xs font-medium text-ink-500">Search</label>
        <SearchInput
          value={filters.search}
          onChange={(v) => setFilter('search', v)}
          placeholder="Title, company, or keyword…"
        />
      </div>

      <SelectField
        label="Department"
        value={filters.department}
        onChange={(v) => setFilter('department', v)}
        options={filterOptions.departments || []}
      />
      <SelectField
        label="Employment type"
        value={filters.employmentType}
        onChange={(v) => setFilter('employmentType', v)}
        options={filterOptions.employmentTypes || []}
      />
      <SelectField
        label="Experience level"
        value={filters.experienceLevel}
        onChange={(v) => setFilter('experienceLevel', v)}
        options={filterOptions.experienceLevels || []}
      />
      <SelectField
        label="Work mode"
        value={filters.remoteFlag}
        onChange={(v) => setFilter('remoteFlag', v)}
        options={filterOptions.remoteFlags || []}
      />

      <label className="flex items-center gap-2 pb-2 text-xs font-medium text-ink-500">
        <input
          type="checkbox"
          checked={!filters.includeDuplicates}
          onChange={(e) => setFilter('includeDuplicates', !e.target.checked)}
          className="rounded border-ink-300 text-signal-500 focus:ring-signal-400"
        />
        Hide duplicates
      </label>

      <Button variant="ghost" onClick={resetFilters}>
        Clear filters
      </Button>
    </div>
  );
}
