import { useCallback, useState } from 'react';
import { useAsync } from '../../../shared/hooks/useAsync';
import * as duplicatesApi from '../infrastructure/duplicates.api';

export function useDuplicateGroups() {
  const [status, setStatus] = useState(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [detecting, setDetecting] = useState(false);

  const fetchGroups = useCallback(
    () => duplicatesApi.getDuplicateGroups({ status: status || undefined, page, limit }),
    [status, page, limit]
  );

  const { data, loading, error, execute, setData } = useAsync(fetchGroups, [status, page]);

  /** Optimistically updates the job's review status in local state, then persists it. */
  const reviewJob = useCallback(
    async (jobId, newStatus) => {
      setData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          groups: prev.groups.map((group) => ({
            ...group,
            jobs: group.jobs.map((job) =>
              job._id === jobId ? { ...job, duplicateReviewStatus: newStatus } : job
            ),
          })),
        };
      });
      await duplicatesApi.reviewJob(jobId, newStatus);
    },
    [setData]
  );

  const runDetection = useCallback(async () => {
    setDetecting(true);
    try {
      const summary = await duplicatesApi.runDetection();
      await execute();
      return summary;
    } finally {
      setDetecting(false);
    }
  }, [execute]);

  return {
    groups: data?.groups || [],
    pagination: data?.pagination || { total: 0, page: 1, totalPages: 1 },
    status,
    setStatus,
    page,
    setPage,
    loading,
    error,
    retry: execute,
    reviewJob,
    runDetection,
    detecting,
  };
}
