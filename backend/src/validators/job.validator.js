import { query, param, body } from "express-validator";

const searchJobsValidator = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("limit must be between 1 and 100"),
  query("sortBy")
    .optional()
    .isIn(["datePosted.parsed", "title", "company", "createdAt"]),
  query("sortOrder").optional().isIn(["asc", "desc"]),
  query("department")
    .optional()
    .isIn(["AI", "Analytics", "Engineering", "Data", "Unknown"]),
  query("employmentType")
    .optional()
    .isIn(["Full Time", "Contract", "Internship", "Unknown"]),
  query("experienceLevel")
    .optional()
    .isIn([
      "Entry Level",
      "Associate",
      "Mid-Senior Level",
      "Director",
      "Executive",
      "Internship",
      "Not Specified",
    ]),
  query("remoteFlag")
    .optional()
    .isIn(["Hybrid", "Onsite", "Remote", "Unknown"]),
  query("applyType").optional().isIn(["EXTERNAL", "EASY_APPLY", "Unknown"]),
];

const jobIdParamValidator = [
  param("id").isMongoId().withMessage("Invalid job id"),
];

const reviewJobValidator = [
  param("jobId").isMongoId().withMessage("Invalid job id"),
  body("status").isIn([
    "confirmed_duplicate",
    "not_duplicate",
    "merged",
    "unreviewed",
  ]),
];

export { searchJobsValidator, jobIdParamValidator, reviewJobValidator };
