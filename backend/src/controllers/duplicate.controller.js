import asyncHandler from "../utils/AsyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import duplicateService from "../services/duplicate.service.js";

const listDuplicateGroups = asyncHandler(async (req, res) => {
  const result = await duplicateService.listDuplicateGroups(req.query);
  res
    .status(200)
    .json(
      new ApiResponse(200, result, "Duplicate groups fetched successfully")
    );
});

const reviewJob = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const updated = await duplicateService.reviewJob(req.params.jobId, status);
  res
    .status(200)
    .json(new ApiResponse(200, updated, "Duplicate review status updated"));
});

const runDetection = asyncHandler(async (req, res) => {
  const summary = await duplicateService.runDetection();
  res
    .status(200)
    .json(new ApiResponse(200, summary, "Duplicate detection completed"));
});

export { listDuplicateGroups, reviewJob, runDetection };
