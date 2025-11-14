"use strict";

const { sanitizeRegexValue } = require("../General/sanitizeRegexValue");
const { createLogInfo } = require("../General/createLogInfo");
const record = require("../Database/record");

const validateAndSanitizeSearch = (
  body,
  allowedFields,
  recordCollection,
  { ip, headers, userData }
) => {
  const originalFieldCount = Object.keys(body).length;

  const newBody = { ...body };

  // Convert search criteria to case-insensitive regex with validation
  for (let key of Object.keys(newBody)) {
    if (!allowedFields.includes(key)) {
      delete newBody[key]; // Remove unauthorized fields
      continue;
    }

    const sanitized = sanitizeRegexValue(newBody[key]);
    if (sanitized) {
      newBody[key] = { $regex: sanitized, $options: "i" };
    } else {
      delete newBody[key]; // Remove invalid values
    }
  }

  // Security check: If user provided search criteria but all were invalid/unauthorized
  if (originalFieldCount > 0 && Object.keys(newBody).length === 0) {
    const infos = createLogInfo({
      ip,
      request: recordCollection,
      professional: userData.professional,
      headers,
      error: "All provided search criteria were invalid or unauthorized",
    });
    record(infos, recordCollection);
    throw new Error(
      "No valid search criteria provided - returning empty result"
    );
  }

  // Allow empty search (return all records) - no error needed
  return { ...newBody };
};

module.exports = { validateAndSanitizeSearch };
