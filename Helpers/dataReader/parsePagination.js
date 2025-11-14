"use strict";

const CONFIG = {
  MAX_LIMIT: 5000,
  DEFAULT_PAGE: 1,
};

const parsePagination = (requestBody) => {
  const pagination = {
    page: CONFIG.DEFAULT_PAGE,
    limit: CONFIG.MAX_LIMIT,
    skip: 0,
  };

  if (requestBody.pagination) {
    const { page, limit } = requestBody.pagination;

    pagination.page = Math.max(1, parseInt(page) || 1);
    pagination.limit = Math.min(
      CONFIG.MAX_LIMIT,
      Math.max(1, parseInt(limit) || CONFIG.MAX_LIMIT)
    );
    pagination.skip = (pagination.page - 1) * pagination.limit;
  }

  return pagination;
};


module.exports = { parsePagination };