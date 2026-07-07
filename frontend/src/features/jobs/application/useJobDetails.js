import { useCallback } from 'react';
import { useAsync } from '../../../shared/hooks/useAsync';
import * as jobsApi from '../infrastructure/jobs.api';

export function useJobDetails(id) {
  const fetchJob = useCallback(() => jobsApi.getJobById(id), [id]);
  const { data, loading, error, execute } = useAsync(fetchJob, [id]);

  return { job: data, loading, error, retry: execute };
}
