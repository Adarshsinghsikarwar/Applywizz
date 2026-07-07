import { httpClient } from '../../../shared/lib/httpClient';

/**
 * Infrastructure layer: thin wrappers around HTTP calls. No business logic,
 * no formatting — that belongs in the domain layer. If the backend URL or
 * transport changes, this is the only file that needs to change.
 */

export async function searchJobs(params) {
  return httpClient.get('/jobs', { params });
}

export async function getJobById(id) {
  return httpClient.get(`/jobs/${id}`);
}

export async function getFilterOptions() {
  return httpClient.get('/jobs/filters/options');
}
