/**
 * Sanitizes input to prevent NoSQL injection and other malicious attempts.
 * @param {string} input - The input string to sanitize.
 * @returns {string} The sanitized string.
 */
const sanitize = (input) => {
  if (typeof input !== "string") return input;

  // Replace potentially dangerous characters
  return input
    .replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

module.exports = sanitize;
