import stringSimilarity from "string-similarity";

/** Jaccard similarity between two token sets (0-1). */
function jaccardSimilarity(setA, setB) {
  if (setA.size === 0 && setB.size === 0) return 1;
  if (setA.size === 0 || setB.size === 0) return 0;
  let intersection = 0;
  for (const tok of setA) {
    if (setB.has(tok)) intersection += 1;
  }
  const union = setA.size + setB.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

/** Dice coefficient string similarity (0-1), good for short strings like titles. */
function diceSimilarity(strA, strB) {
  if (!strA || !strB) return 0;
  return stringSimilarity.compareTwoStrings(strA, strB);
}

/**
 * Combined similarity score for two jobs used to decide near-duplicate status.
 * Weighted: title similarity matters most, then description overlap, then location.
 */
function combinedJobSimilarity(jobA, jobB) {
  const titleScore = diceSimilarity(jobA.normalizedTitle, jobB.normalizedTitle);
  const descScore = jaccardSimilarity(
    jobA.descriptionTokens,
    jobB.descriptionTokens
  );
  const locationScore =
    jobA.normalizedLocation === jobB.normalizedLocation ? 1 : 0;

  return titleScore * 0.55 + descScore * 0.35 + locationScore * 0.1;
}

export { jaccardSimilarity, diceSimilarity, combinedJobSimilarity };
