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
    query.$text = { $search: filters.search };
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
    { $group: { _id: '$duplicateGroupId', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $skip: skip },
    { $limit: limit },
  ]);

  const groupIds = groupIdsAgg.map((g) => g._id);
  const totalGroupsAgg = await Job.aggregate([
    { $match: match },
    { $group: { _id: '$duplicateGroupId' } },
    { $count: 'total' },
  ]);

  const jobs = await Job.find({ duplicateGroupId: { $in: groupIds } })
    .sort({ isPrimaryInGroup: -1, duplicateScore: -1 })
    .lean();

  const groupsMap = new Map();
  for (const job of jobs) {
    if (!groupsMap.has(job.duplicateGroupId)) groupsMap.set(job.duplicateGroupId, []);
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
      totalPages: Math.max(1, Math.ceil((totalGroupsAgg[0]?.total || 0) / limit)),
    },
  };
}
