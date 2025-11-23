"use strict";

/**
 * Validates optional fields
 * @param {Object} body - Request body object
 * @returns {Object} - { isValid: boolean, errorMessage?: string, values?: Object }
 */
const validateOptionalFields = (body) => {
  const values = {};
  
  try {
    if (body.cleExterneClient) {
      values.cleExterneClient = body.cleExterneClient
        .toLowerCase()
        .replace(/\s/g, "");
    }
  } catch (error) {
    return { isValid: false, errorMessage: `[cleExterneClient] ${error.message || error}` };
  }

  return { isValid: true, values };
};

module.exports = { validateOptionalFields };