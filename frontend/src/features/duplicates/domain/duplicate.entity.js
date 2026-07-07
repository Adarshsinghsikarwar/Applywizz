/** Domain layer: labels and rules for the duplicate-review workflow. */

const DUPLICATE_TYPE_LABEL = {
  exact_url: 'Same posting URL',
  exact_content: 'Identical title, company & location',
  near_duplicate: 'Likely near-duplicate',
};

export function duplicateTypeLabel(type) {
  return DUPLICATE_TYPE_LABEL[type] || 'Unclassified';
}

const REVIEW_STATUS_VARIANT = {
  unreviewed: 'neutral',
  confirmed_duplicate: 'alert',
  not_duplicate: 'signal',
  merged: 'signal',
};

export function reviewStatusVariant(status) {
  return REVIEW_STATUS_VARIANT[status] || 'neutral';
}

const REVIEW_STATUS_LABEL = {
  unreviewed: 'Unreviewed',
  confirmed_duplicate: 'Confirmed duplicate',
  not_duplicate: 'Not a duplicate',
  merged: 'Merged',
};

export function reviewStatusLabel(status) {
  return REVIEW_STATUS_LABEL[status] || status;
}

export const REVIEW_STATUS_OPTIONS = [
  'unreviewed',
  'confirmed_duplicate',
  'not_duplicate',
  'merged',
];
