"use strict";

const calculatePaginationMetadata = (totalRecords, pagination) => {
  const totalPages = Math.ceil(totalRecords / pagination.limit);
  const hasNextPage = pagination.page < totalPages;
  const hasPrevPage = pagination.page > 1;

  return { totalPages, hasNextPage, hasPrevPage };
};

/**
 * Build the response object with flat structure for backward compatibility
 */
const buildDataResponse = (data, pagination, totalRecords) => {
  const { totalPages, hasNextPage, hasPrevPage } = calculatePaginationMetadata(
    totalRecords,
    pagination
  );

  return {
    data,                    // ← Direct array (backward compatible)
    pagination: {            // ← Pagination at top level
      page: pagination.page,
      limit: pagination.limit,
      totalRecords,
      totalPages,
      hasNextPage,
      hasPrevPage,
      currentPageCount: data.length, // Actual number of records returned
    },
  };
};

module.exports = { calculatePaginationMetadata, buildDataResponse };
