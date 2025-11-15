"use strict";

function createApiResponse(success, data, message = null, pagination = null) {
  const result = {
    boolean: success,
    data,
    message,
  };

  // Add pagination at top level if provided
  if (pagination) {
    result.pagination = pagination;
  }

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
