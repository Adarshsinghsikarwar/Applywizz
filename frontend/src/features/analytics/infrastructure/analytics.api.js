import { httpClient } from '../../../shared/lib/httpClient';

export async function getDashboardMetrics() {
  return httpClient.get('/analytics/dashboard');
}
