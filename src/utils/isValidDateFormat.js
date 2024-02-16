/**
 * Check if the date string is in the valid format (YYYY-MM-DDTHH:mm:ss or ISO string)
 * @param {string} dateString
 * @returns {boolean}
 */
const isValidDateFormat = (dateString) => {
  if (!dateString) return false;
  // Regex to match YYYY-MM-DDTHH:mm:ss or ISO string format (YYYY-MM-DDTHH:mm:ss.sssZ)
  const regex =
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?(Z|[\+\-]\d{2}:\d{2})?$/;
  return regex.test(dateString);
};

module.exports = isValidDateFormat;
