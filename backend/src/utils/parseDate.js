/**
 * The dataset's datePosted column is mostly valid ISO timestamps, but ~6% are
 * garbage: "32/13/2026" (no such day/month), "2026-99-01" (no such month),
 * or relative strings like "Yesterday". We never want a bad row to blow up
 * the import, so this always returns a safe object instead of throwing.
 */
function safeParseDate(raw) {
  const rawValue = raw === undefined || raw === null ? "" : String(raw).trim();

  if (!rawValue) {
    return { raw: rawValue, parsed: null, isValid: false };
  }

  if (/^yesterday$/i.test(rawValue)) {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return { raw: rawValue, parsed: d, isValid: true };
  }

  if (/^today$/i.test(rawValue)) {
    return { raw: rawValue, parsed: new Date(), isValid: true };
  }

  const parsed = new Date(rawValue);
  const isValid =
    !Number.isNaN(parsed.getTime()) &&
    parsed.getFullYear() > 1970 &&
    parsed.getFullYear() < 2100;

  return { raw: rawValue, parsed: isValid ? parsed : null, isValid };
}

export { safeParseDate };
