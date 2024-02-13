// Validation utility
function validateQueryParams(req, res, next) {
  let { page, pageSize } = req.query;

  // Default values if not provided
  page = page || 1;
  pageSize = pageSize || 100; // Assuming 100 blocks per page

  // Convert to numbers and validate
  page = parseInt(page);
  pageSize = parseInt(pageSize);

  if (isNaN(page) || page < 1) {
    return res.status(400).json({ error: "Invalid page number." });
  }

  if (isNaN(pageSize) || pageSize < 1) {
    return res.status(400).json({ error: "Invalid page size." });
  }

  req.validatedParams = { page, pageSize };
  next();
}

module.exports = validateQueryParams;
