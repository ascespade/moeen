const { createId } = require('@paralleldrive/cuid2');

// Generate a public ID with prefix
function generatePublicId(prefix = '') {
  const cuid = createId();
  return prefix ? `${prefix}_${cuid}` : cuid;
}

// Generate a short ID (8 characters)
function generateShortId() {
  return createId().slice(0, 8);
}

// Generate a legacy CUID (for backward compatibility)
function generateLegacyCuid() {
  return createId();
}

module.exports = {
  generatePublicId,
  generateShortId,
  generateLegacyCuid,
  createId
};
