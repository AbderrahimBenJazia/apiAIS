"use strict";
const { normalizeHeaders } = require("./normalizeHeaders");

const extractRequestContext = (event) => {
  let headers = { ...event.headers };
  const ip = headers["x-forwarded-for"] || headers["X-Forwarded-For"];

  headers = normalizeHeaders(headers);

  return { headers, ip };
};

module.exports = { extractRequestContext };
