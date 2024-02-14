/**
 * Check if the date string is in the valid format
 * @param {string} dateString
 * @returns {boolean}
 */
const isValidDateFormat = (dateString) => {
  if (!dateString) return false;
  const regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/;
  return regex.test(dateString);
};

module.exports = isValidDateFormat;
