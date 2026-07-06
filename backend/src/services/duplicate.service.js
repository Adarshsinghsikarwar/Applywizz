import jobRepository from "../repositories/job.repository.js";
import { detectAndFlagDuplicates } from "./dedup.service.js";
import ApiError from "../utils/ApiError.js";

async function listDuplicateGroups(query) {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(query.limit, 10) || 10));
  return jobRepository.findDuplicateGroups({
    page,
    limit,
    status: query.status,
  });
}

async function reviewJob(jobId, status) {
  const allowed = [
    "confirmed_duplicate",
    "not_duplicate",
    "merged",
    "unreviewed",
  ];
  if (!allowed.includes(status)) {
    throw ApiError.badRequest(`status must be one of: ${allowed.join(", ")}`);
  }
  const updated = await jobRepository.updateDuplicateReviewStatus(
    jobId,
    status
  );
  if (!updated) throw ApiError.notFound("Job not found");
  return updated;
}

async function runDetection() {
  return detectAndFlagDuplicates();
}

export { listDuplicateGroups, reviewJob, runDetection };
