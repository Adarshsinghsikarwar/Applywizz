import Job from "../models/job.model.js";

const ALLOWED_SORT_FIELDS = new Set([
  "datePosted.parsed",
  "title",
  "company",
  "createdAt",
]);

function buildFilterQuery(filters = {}) {
  const query = {};

  if (filters.search) {
    const escapedSearch = filters.search.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
    query.$or = [
      { company: { $regex: escapedSearch, $options: "i" } },
      { title: { $regex: escapedSearch, $options: "i" } },
    ];
  }
  if (filters.department) query.department = filters.department;
  if (filters.employmentType) query.employmentType = filters.employmentType;
  if (filters.experienceLevel) query.experienceLevel = filters.experienceLevel;
  if (filters.remoteFlag) query.remoteFlag = filters.remoteFlag;
  if (filters.applyType) query.applyType = filters.applyType;
  if (filters.company) query.normalizedCompany = filters.company.toLowerCase();
  if (filters.country) query["location.country"] = filters.country;

  if (
    filters.includeDuplicates === false ||
    filters.includeDuplicates === "false"
  ) {
    query.isDuplicate = { $ne: true };
  }

  if (filters.datePostedFrom || filters.datePostedTo) {
    query["datePosted.parsed"] = {};
    if (filters.datePostedFrom)
      query["datePosted.parsed"].$gte = new Date(filters.datePostedFrom);
    if (filters.datePostedTo)
      query["datePosted.parsed"].$lte = new Date(filters.datePostedTo);
  }

  return query;
}

async function findJobs({
  filters,
  page = 1,
  limit = 20,
  sortBy = "datePosted.parsed",
  sortOrder = "desc",
}) {
  const query = buildFilterQuery(filters);
  const sortField = ALLOWED_SORT_FIELDS.has(sortBy)
    ? sortBy
    : "datePosted.parsed";
  const sort = { [sortField]: sortOrder === "asc" ? 1 : -1 };

  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Job.find(query).sort(sort).skip(skip).limit(limit).lean(),
    Job.countDocuments(query),
  ]);

  return {
    items,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    },
  };
}

async function findById(id) {
  return Job.findById(id).lean();
}

async function getDistinctValues(field) {
  return Job.distinct(field);
}

async function findDuplicateGroups({ page = 1, limit = 20, status } = {}) {
  const skip = (page - 1) * limit;
  const match = { duplicateGroupId: { $ne: null } };
  if (status) match.duplicateReviewStatus = status;

  const groupIdsAgg = await Job.aggregate([
    { $match: match },
    { $group: { _id: "$duplicateGroupId", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $skip: skip },
    { $limit: limit },
  ]);

  const groupIds = groupIdsAgg.map((g) => g._id);
  const totalGroupsAgg = await Job.aggregate([
    { $match: match },
    { $group: { _id: "$duplicateGroupId" } },
    { $count: "total" },
  ]);

  const jobs = await Job.find({ duplicateGroupId: { $in: groupIds } })
    .sort({ isPrimaryInGroup: -1, duplicateScore: -1 })
    .lean();

  const groupsMap = new Map();
  for (const job of jobs) {
    if (!groupsMap.has(job.duplicateGroupId))
      groupsMap.set(job.duplicateGroupId, []);
    groupsMap.get(job.duplicateGroupId).push(job);
  }

  const groups = groupIds.map((id) => ({
    duplicateGroupId: id,
    jobs: groupsMap.get(id) || [],
  }));

  return {
    groups,
    pagination: {
      total: totalGroupsAgg[0]?.total || 0,
      page,
      limit,
      totalPages: Math.max(
        1,
        Math.ceil((totalGroupsAgg[0]?.total || 0) / limit)
      ),
    },
  };
}

async function updateDuplicateReviewStatus(jobId, status) {
  return Job.findByIdAndUpdate(
    jobId,
    { duplicateReviewStatus: status },
    { new: true }
  ).lean();
}

async function getAggregateCounts() {
  const [totalJobs, totalDuplicates, totalCompanies] = await Promise.all([
    Job.countDocuments({}),
    Job.countDocuments({ isDuplicate: true }),
    Job.distinct("normalizedCompany").then((arr) => arr.length),
  ]);
  return { totalJobs, totalDuplicates, totalCompanies };
}

async function groupCountBy(field) {
  return Job.aggregate([
    { $group: { _id: `$${field}`, count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);
}

async function postingsTrend(days = 30) {
  const since = new Date();
  since.setDate(since.getDate() - days);
  return Job.aggregate([
    { $match: { "datePosted.parsed": { $gte: since, $ne: null } } },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$datePosted.parsed" },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);
}

async function topCompanies(limit = 10) {
  return Job.aggregate([
    { $group: { _id: "$company", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: limit },
  ]);
}

const jobRepository = {
  findJobs,
  findById,
  getDistinctValues,
  findDuplicateGroups,
  updateDuplicateReviewStatus,
  getAggregateCounts,
  groupCountBy,
  postingsTrend,
  topCompanies,
};

export default jobRepository;
