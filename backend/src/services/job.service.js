import jobRepository from "../repositories/job.repository.js";
import ApiError from "../utils/ApiError.js";

async function searchJobs(query) {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit, 10) || 20));

  const filters = {
    search: query.search,
    department: query.department,
    employmentType: query.employmentType,
    experienceLevel: query.experienceLevel,
    remoteFlag: query.remoteFlag,
    applyType: query.applyType,
    company: query.company,
    country: query.country,
    includeDuplicates: query.includeDuplicates,
    datePostedFrom: query.datePostedFrom,
    datePostedTo: query.datePostedTo,
  };

  return jobRepository.findJobs({
    filters,
    page,
    limit,
    sortBy: query.sortBy,
    sortOrder: query.sortOrder,
  });
}

async function getJobById(id) {
  const job = await jobRepository.findById(id);
  if (!job) throw new ApiError(404, "Job not found");
  return job;
}

async function getFilterOptions() {
  const [
    departments,
    employmentTypes,
    experienceLevels,
    remoteFlags,
    applyTypes,
  ] = await Promise.all([
    jobRepository.getDistinctValues("department"),
    jobRepository.getDistinctValues("employmentType"),
    jobRepository.getDistinctValues("experienceLevel"),
    jobRepository.getDistinctValues("remoteFlag"),
    jobRepository.getDistinctValues("applyType"),
  ]);

  return {
    departments,
    employmentTypes,
    experienceLevels,
    remoteFlags,
    applyTypes,
  };
}

export { searchJobs, getJobById, getFilterOptions };
