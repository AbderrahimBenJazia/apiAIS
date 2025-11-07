"use strict";

const normalizeHeaders = (headers) => {
  // Handle key name changes by axios, normalize headers
  const normalizedHeaders = {};
  for (let key of Object.keys(headers)) {
    const normalizedKey = key[0].toUpperCase() + key.slice(1).toLowerCase();
    normalizedHeaders[normalizedKey] = Array.isArray(headers[key])
      ? headers[key]
      : [headers[key]];
  }

  return normalizedHeaders;
};
module.exports = { normalizeHeaders };
