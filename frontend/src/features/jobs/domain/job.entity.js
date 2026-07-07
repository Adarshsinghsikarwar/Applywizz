/**
 * Domain layer: pure functions describing what a Job "means" and how it
 * should be presented. Nothing here imports React or talks to the network —
 * that separation is what lets this be unit-tested with zero setup, and
 * reused identically by both the search list and the details page.
 */

const EXPERIENCE_BADGE_VARIANT = {
  'Entry Level': 'signal',
  Internship: 'signal',
  Associate: 'neutral',
  'Mid-Senior Level': 'neutral',
  Director: 'neutral',
  Executive: 'neutral',
  'Not Specified': 'neutral',
};

const REMOTE_BADGE_VARIANT = {
  Remote: 'signal',
  Hybrid: 'neutral',
  Onsite: 'neutral',
  Unknown: 'neutral',
};

export function experienceBadgeVariant(level) {
  return EXPERIENCE_BADGE_VARIANT[level] || 'neutral';
}

export function remoteBadgeVariant(flag) {
  return REMOTE_BADGE_VARIANT[flag] || 'neutral';
}

/** Formats the location object the backend returns into a single display string. */
export function formatLocation(location) {
  if (!location) return 'Location not specified';
  const parts = [location.city, location.state, location.country].filter(Boolean);
  if (parts.length > 0) return parts.join(', ');
  return location.raw || 'Location not specified';
}

/**
 * The dataset's salary data is best-effort (see backend README) — only 5
 * distinct raw values across the whole dataset. We're honest about that
 * here rather than presenting fabricated precision.
 */
export function formatSalary(salary) {
  if (!salary) return 'Not disclosed';
  if (salary.isNegotiable) return 'Negotiable';
  if (salary.isCompetitive) return 'Competitive (not disclosed)';
  if (salary.min && salary.max) {
    const currencySymbol = { USD: '$', INR: '₹', EUR: '€' }[salary.currency] || '';
    const fmt = (n) => new Intl.NumberFormat('en-IN').format(Math.round(n));
    return `${currencySymbol}${fmt(salary.min)} – ${currencySymbol}${fmt(salary.max)}`;
  }
  return salary.raw || 'Not disclosed';
}

/** Short list of chips describing a job at a glance, used on the card and details page. */
export function jobHighlights(job) {
  return [
    { key: 'employmentType', label: job.employmentType, variant: 'neutral' },
    { key: 'experienceLevel', label: job.experienceLevel, variant: experienceBadgeVariant(job.experienceLevel) },
    { key: 'remoteFlag', label: job.remoteFlag, variant: remoteBadgeVariant(job.remoteFlag) },
  ].filter((h) => h.label && h.label !== 'Unknown');
}

export function isDataIncomplete(job) {
  return Boolean(job?.dataQuality?.missingFields?.length);
}
