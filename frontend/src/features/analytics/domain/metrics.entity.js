/** Domain layer: shapes raw aggregation data into what a chart component needs. */

export function toPercentage(part, total) {
  if (!total) return 0;
  return Number(((part / total) * 100).toFixed(1));
}

/** Backend returns [{ _id, count }] from Mongo aggregation — reshape to {name, value}. */
export function shapeBreakdown(breakdown = []) {
  return breakdown
    .filter((b) => b._id) // drop null/undefined buckets
    .map((b) => ({ name: b._id, value: b.count }));
}

export function shapeTrend(trend = []) {
  return trend.map((t) => ({ date: t._id, count: t.count }));
}
