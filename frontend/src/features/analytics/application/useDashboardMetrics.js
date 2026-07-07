import { useAsync } from '../../../shared/hooks/useAsync';
import * as analyticsApi from '../infrastructure/analytics.api';

export function useDashboardMetrics() {
  const { data, loading, error, execute } = useAsync(analyticsApi.getDashboardMetrics, []);
  return { metrics: data, loading, error, retry: execute };
}
