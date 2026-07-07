import { useJobSearch } from '../../application/useJobSearch';
import JobFilters from '../components/JobFilters';
import JobList from '../components/JobList';

export default function JobSearchPage() {
  const {
    jobs,
    pagination,
    filters,
    setFilter,
    resetFilters,
    page,
    setPage,
    loading,
    error,
    retry,
    filterOptions,
  } = useJobSearch();

  return (
    <div className="flex flex-col gap-6">
      {/* Header section */}
      <div className="flex flex-col gap-1 border-b border-ink-100 pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-ink-900">Postings Database</h1>
        <p className="text-sm text-ink-500">
          Filter, sort, and browse every analyzed job posting in the active dataset.
        </p>
      </div>

      <JobFilters
        filters={filters}
        setFilter={setFilter}
        resetFilters={resetFilters}
        filterOptions={filterOptions}
      />

      <JobList
        jobs={jobs}
        loading={loading}
        error={error}
        retry={retry}
        pagination={pagination}
        page={page}
        setPage={setPage}
      />
    </div>
  );
}
