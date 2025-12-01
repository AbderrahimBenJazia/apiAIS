"use strict";

const { validateField } = require('./validateFieldUtils');

// Pattern for external client key: alphanumeric, hyphens, underscores only
const EXTERNAL_KEY_PATTERN = /^[a-z0-9_-]+$/;
const EXTERNAL_KEY_MAX_LENGTH = 100;

const validateOptionalFields = (body) => {
  const values = {};
  
  if (body.cleExterneClient) {
    // Use shared field validation
    const fieldValidation = validateField(body.cleExterneClient, "cleExterneClient",false);
    if (!fieldValidation.isValid) return fieldValidation;

    // Normalize: lowercase and remove spaces
    const normalized = String(body.cleExterneClient)
      .toLowerCase()
      .replace(/\s/g, "");

    // Length validation
    if (normalized.length > EXTERNAL_KEY_MAX_LENGTH) {
      return {
        isValid: false,
        errorMessage: `[check] [cleExterneClient] trop longue (max ${EXTERNAL_KEY_MAX_LENGTH} caractères)`,
      };
    }

    // Pattern validation: only alphanumeric, hyphens, underscores
    if (!EXTERNAL_KEY_PATTERN.test(normalized)) {
      return {
        isValid: false,
        errorMessage: "[check] [cleExterneClient] format invalide. Seuls les caractères alphanumériques, tirets et underscores sont acceptés",
      };
    }

    values.cleExterneClient = normalized;
  }

  return { isValid: true, values };
};

module.exports = { validateOptionalFields };