import { httpClient } from '../../../shared/lib/httpClient';

export async function getDuplicateGroups(params) {
  return httpClient.get('/duplicates', { params });
}

export async function reviewJob(jobId, status) {
  return httpClient.patch(`/duplicates/${jobId}/review`, { status });
}

export async function runDetection() {
  return httpClient.post('/duplicates/detect');
}
