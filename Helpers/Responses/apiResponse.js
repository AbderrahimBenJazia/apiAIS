"use strict";

const { getErrorMessage } = require("./messages");

/**
 * Create a standardized API response
 * @param {boolean} success - Whether the operation was successful
 * @param {any} data - The response data (for success) or error message (for failure)
 * @param {string} message - Optional message
 * @returns {Object} - Standardized Lambda response object
 */
function createApiResponse(success, data, message = null) {
  const result = {
    boolean: success,
    data,
    message,
  };

  return {
    statusCode: 200, // Always return 200 status
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers":
        "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,keypublic,keyprivate",
      "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
    },
    body: JSON.stringify(result),
  };
}

module.exports = createApiResponse;
