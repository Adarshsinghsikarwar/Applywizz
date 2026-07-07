/**
 * The dataset's salary column only has 5 distinct non-null values across
 * 10,000 rows: "Negotiable", "Competitive", "₹15-20 LPA", "18,00,000",
 * "$90k-$110k" — placeholder-like, not precise per-job data. We never
 * pretend these are exact numbers; we extract a best-effort numeric range
 * in a single normalized currency-agnostic unit (annual USD-equivalent is
 * NOT attempted, since we have no reliable FX/period info) and always keep
 * the raw string for display and honesty.
 */
function parseSalary(rawSalary, rawCurrency) {
  const raw = (rawSalary || "").toString().trim();
  const currency = (rawCurrency || "").toString().trim().toUpperCase() || null;

  const result = {
    raw: raw || null,
    currency: ["USD", "INR", "EUR"].includes(currency) ? currency : null,
    min: null,
    max: null,
    isNegotiable: false,
    isCompetitive: false,
  };

  if (!raw) return result;

  if (/negotiable/i.test(raw)) {
    result.isNegotiable = true;
    return result;
  }
  if (/competitive/i.test(raw)) {
    result.isCompetitive = true;
    return result;
  }

  // "₹15-20 LPA" -> lakhs per annum (1 LPA = 100,000)
  const lpaMatch = raw.match(/([\d.]+)\s*-\s*([\d.]+)\s*LPA/i);
  if (lpaMatch) {
    result.min = parseFloat(lpaMatch[1]) * 100000;
    result.max = parseFloat(lpaMatch[2]) * 100000;
    result.currency = result.currency || "INR";
    return result;
  }

  // "18,00,000" (Indian digit grouping, single figure)
  const indianGrouped = raw.match(/^[\d,]+$/);
  if (indianGrouped) {
    const numeric = parseFloat(raw.replace(/,/g, ""));
    if (!Number.isNaN(numeric)) {
      result.min = numeric;
      result.max = numeric;
      return result;
    }
  }

  // "$90k-$110k"
  const kRangeMatch = raw.match(/\$?([\d.]+)\s*k\s*-\s*\$?([\d.]+)\s*k/i);
  if (kRangeMatch) {
    result.min = parseFloat(kRangeMatch[1]) * 1000;
    result.max = parseFloat(kRangeMatch[2]) * 1000;
    result.currency = result.currency || "USD";
    return result;
  }

  // Fallback: pull any numeric range out generically, e.g. "84,500 - 140,800"
  const genericRange = raw.match(/([\d,.]+)\s*-\s*([\d,.]+)/);
  if (genericRange) {
    const min = parseFloat(genericRange[1].replace(/,/g, ""));
    const max = parseFloat(genericRange[2].replace(/,/g, ""));
    if (!Number.isNaN(min) && !Number.isNaN(max)) {
      result.min = min;
      result.max = max;
    }
  }

  return result;
}

export { parseSalary };
