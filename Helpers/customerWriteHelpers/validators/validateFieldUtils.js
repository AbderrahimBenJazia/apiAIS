"use strict";

const validateField = (value, fieldName, allowNumber = true) => {
  if (!value) {
    return {
      isValid: false,
      errorMessage: `[${fieldName}] n'est pas défini`,
    };
  }

  const validTypes = allowNumber ? ["string", "number"] : ["string"];

  if (!validTypes.includes(typeof value)) {
    const expectedType = allowNumber
      ? "une chaîne de caractères ou un nombre"
      : "une chaîne de caractères";
    return {
      isValid: false,
      errorMessage: `[${fieldName}] doit être ${expectedType}`,
    };
  }

  return { isValid: true };
};

module.exports = { validateField };