import crypto from "crypto";
import Job from "../models/job.model.js";
import { tokenize } from "../utils/normalize.js";
import { combinedJobSimilarity } from "../utils/similarity.js";
import { config } from "../config/env.js";

/** Minimal disjoint-set (union-find) to merge duplicate signals from multiple sources. */
class DisjointSet {
  constructor(ids) {
    this.parent = new Map(ids.map((id) => [id, id]));
  }
  find(x) {
    while (this.parent.get(x) !== x) {
      this.parent.set(x, this.parent.get(this.parent.get(x)));
      x = this.parent.get(x);
    }
    return x;
  }
  union(a, b) {
    const ra = this.find(a);
    const rb = this.find(b);
    if (ra !== rb) this.parent.set(ra, rb);
  }
}

/**
 * Runs duplicate detection across the entire Job collection and persists the
 * results (duplicateGroupId, isDuplicate, isPrimaryInGroup, duplicateScore,
 * duplicateType). Safe to re-run at any time — it recomputes from scratch.
 *
 * Strategy (cheapest/most-certain signal first):
 *   1. Exact match on non-null `url` -> duplicateType: 'exact_url'
 *   2. Exact match on `contentHash` (normalized title+company+location) -> 'exact_content'
 *   3. Near-duplicate: blocked by company + first 2 title tokens, then scored
 *      with a weighted title/description/location similarity -> 'near_duplicate'
 */
async function detectAndFlagDuplicates() {
  const jobs = await Job.find({})
    .select(
      "_id url contentHash normalizedTitle normalizedCompany location.normalized description.text datePosted.parsed createdAt"
    )
    .lean();

  if (jobs.length === 0) {
    return { totalJobs: 0, duplicateGroups: 0, duplicateJobs: 0 };
  }

  const ids = jobs.map((j) => String(j._id));
  const dsu = new DisjointSet(ids);

  const byField = (getKey) => {
    const map = new Map();
    for (const job of jobs) {
      const key = getKey(job);
      if (!key) continue;
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(job);
    }
    return map;
  };

  // --- Signal 1: exact URL match ---
  const byUrl = byField((j) => j.url);
  const urlDuplicateIds = new Set();
  for (const group of byUrl.values()) {
    if (group.length < 2) continue;
    for (let i = 1; i < group.length; i += 1) {
      dsu.union(String(group[0]._id), String(group[i]._id));
      urlDuplicateIds.add(String(group[i]._id));
    }
  }

  // --- Signal 2: exact content hash match (normalized title+company+location) ---
  const byHash = byField((j) => j.contentHash);
  const hashDuplicateIds = new Set();
  for (const group of byHash.values()) {
    if (group.length < 2) continue;
    for (let i = 1; i < group.length; i += 1) {
      dsu.union(String(group[0]._id), String(group[i]._id));
      hashDuplicateIds.add(String(group[i]._id));
    }
  }

  // --- Signal 3: near-duplicate via blocking + weighted similarity ---
  const enriched = jobs.map((j) => ({
    id: String(j._id),
    normalizedTitle: j.normalizedTitle || "",
    normalizedCompany: j.normalizedCompany || "",
    normalizedLocation: j.location?.normalized || "",
    descriptionTokens: tokenize(j.description?.text || ""),
    createdAt: j.createdAt,
  }));

  const blocks = new Map();
  for (const job of enriched) {
    const titleTokens = job.normalizedTitle
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .join(" ");
    const blockKey = `${job.normalizedCompany}::${titleTokens}`;
    if (!blocks.has(blockKey)) blocks.set(blockKey, []);
    blocks.get(blockKey).push(job);
  }

  const nearDuplicatePairs = []; // { a, b, score }
  for (const block of blocks.values()) {
    if (block.length < 2) continue;
    for (let i = 0; i < block.length; i += 1) {
      for (let j = i + 1; j < block.length; j += 1) {
        const score = combinedJobSimilarity(block[i], block[j]);
        if (score >= config.duplicateSimilarityThreshold) {
          dsu.union(block[i].id, block[j].id);
          nearDuplicatePairs.push({ a: block[i].id, b: block[j].id, score });
        }
      }
    }
  }

  // --- Build final groups from the union-find structure ---
  const groupsByRoot = new Map();
  for (const id of ids) {
    const root = dsu.find(id);
    if (!groupsByRoot.has(root)) groupsByRoot.set(root, []);
    groupsByRoot.get(root).push(id);
  }

  const jobById = new Map(jobs.map((j) => [String(j._id), j]));
  const scoreByPairKey = new Map();
  for (const { a, b, score } of nearDuplicatePairs) {
    scoreByPairKey.set([a, b].sort().join("|"), score);
  }

  const bulkOps = [];
  let duplicateGroups = 0;
  let duplicateJobs = 0;

  for (const [root, members] of groupsByRoot.entries()) {
    if (members.length < 2) {
      // Singleton: not part of any duplicate group
      bulkOps.push({
        updateOne: {
          filter: { _id: root },
          update: {
            $set: {
              duplicateGroupId: null,
              isDuplicate: false,
              isPrimaryInGroup: true,
              duplicateScore: null,
              duplicateType: null,
            },
          },
        },
      });
      continue;
    }

    duplicateGroups += 1;
    const groupId = crypto
      .createHash("sha1")
      .update(members.sort().join(","))
      .digest("hex")
      .slice(0, 16);

    // Primary = earliest created record (arbitrary but deterministic canonical pick)
    const sortedByAge = [...members].sort((a, b) => {
      const da = new Date(jobById.get(a).createdAt || 0).getTime();
      const db = new Date(jobById.get(b).createdAt || 0).getTime();
      return da - db;
    });
    const primaryId = sortedByAge[0];

    for (const memberId of members) {
      const isPrimary = memberId === primaryId;
      let duplicateType = "near_duplicate";
      if (urlDuplicateIds.has(memberId)) duplicateType = "exact_url";
      else if (hashDuplicateIds.has(memberId)) duplicateType = "exact_content";

      let bestScore = duplicateType === "near_duplicate" ? 0 : 1;
      if (duplicateType === "near_duplicate") {
        for (const otherId of members) {
          if (otherId === memberId) continue;
          const key = [memberId, otherId].sort().join("|");
          if (scoreByPairKey.has(key)) {
            bestScore = Math.max(bestScore, scoreByPairKey.get(key));
          }
        }
      }

      if (!isPrimary) duplicateJobs += 1;

      bulkOps.push({
        updateOne: {
          filter: { _id: memberId },
          update: {
            $set: {
              duplicateGroupId: groupId,
              isDuplicate: !isPrimary,
              isPrimaryInGroup: isPrimary,
              duplicateScore: Number(bestScore.toFixed(3)),
              duplicateType,
            },
          },
        },
      });
    }
  }

  if (bulkOps.length > 0) {
    const BATCH = 1000;
    for (let i = 0; i < bulkOps.length; i += BATCH) {
      await Job.bulkWrite(bulkOps.slice(i, i + BATCH));
    }
  }

  return { totalJobs: jobs.length, duplicateGroups, duplicateJobs };
}

export { detectAndFlagDuplicates };