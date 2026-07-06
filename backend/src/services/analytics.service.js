import jobRepository from "../repositories/job.repository.js";

async function getDashboardMetrics() {
  const [
    counts,
    byDepartment,
    byEmploymentType,
    byExperienceLevel,
    byRemoteFlag,
    trend,
    topCompanies,
  ] = await Promise.all([
    jobRepository.getAggregateCounts(),
    jobRepository.groupCountBy("department"),
    jobRepository.groupCountBy("employmentType"),
    jobRepository.groupCountBy("experienceLevel"),
    jobRepository.groupCountBy("remoteFlag"),
    jobRepository.postingsTrend(30),
    jobRepository.topCompanies(10),
  ]);

  return {
    totals: {
      totalJobs: counts.totalJobs,
      totalCompanies: counts.totalCompanies,
      totalDuplicateJobs: counts.totalDuplicates,
      duplicateRate: counts.totalJobs
        ? Number(((counts.totalDuplicates / counts.totalJobs) * 100).toFixed(2))
        : 0,
    },
    breakdowns: {
      byDepartment,
      byEmploymentType,
      byExperienceLevel,
      byRemoteFlag,
    },
    postingsTrend: trend,
    topCompanies,
  };
}
