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
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-lg font-semibold text-ink-800">Job search</h1>
        <p className="text-sm text-ink-400">Filter, sort, and browse every posting in the dataset.</p>
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
