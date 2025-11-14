"use strict";

const CONFIG = {
  MAX_STRING_LENGTH: 100,
};

const sanitizeRegexValue = (value) => {
  if (typeof value !== "string" || value.length > CONFIG.MAX_STRING_LENGTH) {
    return null;
  }

  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};
module.exports = { sanitizeRegexValue };