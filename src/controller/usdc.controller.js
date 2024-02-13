const transactionService = require("../services/transaction.service");

exports.get = async (req, res, next) => {
  try {
    const { page, pageSize } = req.validatedParams;

    // Convert page and pageSize to integers (important for security and validation)
    const pageNumber = parseInt(page, 10) || 1; // Default to 1 if page is not provided or invalid
    const pageSizeNumber = parseInt(pageSize, 10) || 100; // Default to 100 if pageSize is not provided or invalid

    // Fetch events using transactionService
    const events = await transactionService.fetchUSDCtransfers(
      pageNumber,
      pageSizeNumber
    );

    // Calculate next and previous page numbers
    const nextPage = pageNumber + 1;
    const prevPage = pageNumber > 1 ? pageNumber - 1 : null; // Previous page is null if current page is 1

    // Prepare the response payload
    const responsePayload = {
      currentPage: pageNumber,
      pageSize: pageSizeNumber,
      nextPage: nextPage,
      prevPage: prevPage,
      events: events,
    };

    return res.standardResponse(200, true, responsePayload, "Success", false);
  } catch (err) {
    // Handle error
    return next(err);
  }
};
