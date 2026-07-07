import SearchInput from '../../../../shared/ui/SearchInput';
import SelectField from '../../../../shared/ui/SelectField';
import Button from '../../../../shared/ui/Button';

export default function JobFilters({ filters, setFilter, resetFilters, filterOptions }) {
  return (
    <div className="flex flex-wrap items-end gap-4 rounded-xl border border-ink-100/70 bg-white p-5 shadow-sm">
      {/* Search Input */}
      <div className="min-w-[240px] flex-[2]">
        <label className="mb-1.5 block text-xs font-semibold tracking-wider text-ink-500 uppercase">
          Keyword Search
        </label>
        <SearchInput
          value={filters.search}
          onChange={(v) => setFilter('search', v)}
          placeholder="Title, company, key skills…"
        />
      </div>

      {/* Select Dropdowns */}
      <div className="min-w-[140px] flex-1">
        <SelectField
          label="Department"
          value={filters.department}
          onChange={(v) => setFilter('department', v)}
          options={filterOptions.departments || []}
        />
      </div>

      <div className="min-w-[140px] flex-1">
        <SelectField
          label="Employment"
          value={filters.employmentType}
          onChange={(v) => setFilter('employmentType', v)}
          options={filterOptions.employmentTypes || []}
        />
      </div>

      <div className="min-w-[140px] flex-1">
        <SelectField
          label="Experience"
          value={filters.experienceLevel}
          onChange={(v) => setFilter('experienceLevel', v)}
          options={filterOptions.experienceLevels || []}
        />
      </div>

      <div className="min-w-[140px] flex-1">
        <SelectField
          label="Mode"
          value={filters.remoteFlag}
          onChange={(v) => setFilter('remoteFlag', v)}
          options={filterOptions.remoteFlags || []}
        />
      </div>

      {/* Checkbox and Clear Button */}
      <div className="flex min-w-[200px] items-center justify-between gap-4 pb-1">
        <label className="flex cursor-pointer items-center gap-2 text-xs font-semibold text-ink-600 select-none">
          <input
            type="checkbox"
            checked={!filters.includeDuplicates}
            onChange={(e) => setFilter('includeDuplicates', !e.target.checked)}
            className="h-4.5 w-4.5 cursor-pointer rounded border-ink-200 text-signal-500 transition-colors focus:ring-signal-500/20"
          />
          Hide duplicates
        </label>

        <Button variant="ghost" onClick={resetFilters} className="!px-2.5 !py-1 text-xs">
          Clear Filters
        </Button>
      </div>
    </div>
  );
}
