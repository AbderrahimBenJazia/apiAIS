"use strict";

const validateBody = (body) => {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return {
      isValid: false,
      errorMessage: "[checkBody] Le corps doit être un objet valide.",
    };
  }
  return { isValid: true };
};

module.exports = { validateBody };
