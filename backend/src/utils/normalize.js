import crypto from "crypto";

/** Collapse whitespace, trim, and lowercase for comparison keys. */
function normalizeText(value = "") {
  if (typeof value !== "string") return "";
  return value.replace(/\s+/g, " ").trim().toLowerCase();
}

/** Clean but preserve original casing for display. */
function cleanDisplayText(value = "") {
  if (typeof value !== "string") return "";
  return value.replace(/\s+/g, " ").trim();
}

const US_STATE_ABBR = new Set([
  "AL",
  "AK",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DE",
  "FL",
  "GA",
  "HI",
  "ID",
  "IL",
  "IN",
  "IA",
  "KS",
  "KY",
  "LA",
  "ME",
  "MD",
  "MA",
  "MI",
  "MN",
  "MS",
  "MO",
  "MT",
  "NE",
  "NV",
  "NH",
  "NJ",
  "NM",
  "NY",
  "NC",
  "ND",
  "OH",
  "OK",
  "OR",
  "PA",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VT",
  "VA",
  "WA",
  "WV",
  "WI",
  "WY",
]);

// Indian states/union territories that appear as the second segment of
// "City, State" style locations in this dataset (e.g. "Bengaluru, Karnataka").
// Without this, a US-state check alone would wrongly treat "Karnataka" as a country.
const INDIAN_STATES = new Set([
  "karnataka",
  "maharashtra",
  "telangana",
  "tamil nadu",
  "delhi",
  "haryana",
  "uttar pradesh",
  "gujarat",
  "west bengal",
  "rajasthan",
  "kerala",
  "punjab",
]);

/**
 * Location strings in the dataset are wildly inconsistent:
 *  "Shepherdsville, KY, US" | "Remote, US" | "MN, US" | "Bangalore" |
 *  "Hybrid - Bangalore" | "BLR" | "US"
 * We extract what we reliably can and never throw on the rest.
 */
function normalizeLocation(raw = "") {
  const clean = cleanDisplayText(raw);
  if (!clean) {
    return {
      raw: clean,
      city: null,
      state: null,
      country: null,
      normalized: "",
      isRemoteHint: false,
    };
  }

  const isRemoteHint = /remote|hybrid/i.test(clean);
  const stripped = clean.replace(/^(remote|hybrid)\s*-\s*/i, "");

  const parts = stripped
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);

  let city = null;
  let state = null;
  let country = null;

  if (parts.length === 3) {
    [city, state, country] = parts;
  } else if (parts.length === 2) {
    const [first, second] = parts;
    if (US_STATE_ABBR.has(second.toUpperCase())) {
      city = first;
      state = second.toUpperCase();
      country = "US";
    } else if (INDIAN_STATES.has(second.toLowerCase())) {
      city = first;
      state = second;
      country = "India";
    } else {
      city = first;
      country = second;
    }
  } else if (parts.length === 1) {
    const single = parts[0];
    if (US_STATE_ABBR.has(single.toUpperCase())) {
      state = single.toUpperCase();
      country = "US";
    } else if (/^(us|usa|united states)$/i.test(single)) {
      country = "US";
    } else {
      city = single;
    }
  }

  const normalized = normalizeText(
    [city, state, country].filter(Boolean).join(", ")
  );

  return { raw: clean, city, state, country, normalized, isRemoteHint };
}

const EXPERIENCE_LEVEL_MAP = [
  {
    pattern: /^(entry level|entry-level|fresher|0-2 years|junior)$/i,
    value: "Entry Level",
  },
  { pattern: /^(2\+ ?yrs|associate)$/i, value: "Associate" },
  { pattern: /^(3-5 years|mid-senior level)$/i, value: "Mid-Senior Level" },
  { pattern: /^(director)$/i, value: "Director" },
  { pattern: /^(executive)$/i, value: "Executive" },
  { pattern: /^(internship)$/i, value: "Internship" },
  { pattern: /^(not applicable|not mentioned)$/i, value: "Not Specified" },
];

function normalizeExperienceLevel(raw) {
  const clean = cleanDisplayText(raw || "");
  if (!clean) return "Not Specified";
  for (const { pattern, value } of EXPERIENCE_LEVEL_MAP) {
    if (pattern.test(clean)) return value;
  }
  return "Not Specified";
}

function normalizeEnum(raw, allowed, fallback = "Unknown") {
  const clean = cleanDisplayText(raw || "");
  const match = allowed.find((a) => a.toLowerCase() === clean.toLowerCase());
  return match || fallback;
}

/** Stable hash used to detect exact/near-identical postings. */
function buildContentHash({ title, company, location }) {
  const key = [
    normalizeText(title),
    normalizeText(company),
    normalizeText(location),
  ].join("|");
  return crypto.createHash("sha256").update(key).digest("hex");
}

/** Tokenize a string into a set of significant lowercase word tokens. */
function tokenize(value = "") {
  return new Set(
    normalizeText(value)
      .split(/[^a-z0-9+]+/)
      .filter((tok) => tok.length > 1)
  );
}

export {
  normalizeText,
  cleanDisplayText,
  normalizeLocation,
  normalizeExperienceLevel,
  normalizeEnum,
  buildContentHash,
  tokenize,
};
