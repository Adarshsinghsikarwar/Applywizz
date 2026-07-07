import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAsync } from '../../../shared/hooks/useAsync';
import { useDebouncedValue } from '../../../shared/hooks/useDebouncedValue';
import * as jobsApi from '../infrastructure/jobs.api';

const DEFAULT_FILTERS = {
  search: '',
  department: null,
  employmentType: null,
  experienceLevel: null,
  remoteFlag: null,
  applyType: null,
  includeDuplicates: true,
  sortBy: 'datePosted.parsed',
  sortOrder: 'desc',
};

/**
 * Application layer: owns filter/pagination state, debounces the search box,
 * and orchestrates the infrastructure (jobs.api) + domain (none needed here —
 * shaping happens in presentation) to give the UI one clean surface.
 */
export function useJobSearch() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);

  const debouncedSearch = useDebouncedValue(filters.search, 350);

  // Reset to page 1 whenever any filter (including debounced search) changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, filters.department, filters.employmentType, filters.experienceLevel, filters.remoteFlag, filters.applyType, filters.includeDuplicates, filters.sortBy, filters.sortOrder]);

  const queryParams = useMemo(
    () => ({
      search: debouncedSearch || undefined,
      department: filters.department || undefined,
      employmentType: filters.employmentType || undefined,
      experienceLevel: filters.experienceLevel || undefined,
      remoteFlag: filters.remoteFlag || undefined,
      applyType: filters.applyType || undefined,
      includeDuplicates: filters.includeDuplicates,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
      page,
      limit,
    }),
    [debouncedSearch, filters, page, limit]
  );

  const fetchJobs = useCallback(() => jobsApi.searchJobs(queryParams), [queryParams]);
  const { data, loading, error, execute } = useAsync(fetchJobs, [queryParams]);

  const { data: filterOptions } = useAsync(jobsApi.getFilterOptions, [], { immediate: true });

  const setFilter = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => setFilters(DEFAULT_FILTERS), []);

  return {
    jobs: data?.items || [],
    pagination: data?.pagination || { total: 0, page: 1, totalPages: 1 },
    filters,
    setFilter,
    resetFilters,
    page,
    setPage,
    loading,
    error,
    retry: execute,
    filterOptions: filterOptions || {},
  };
}
