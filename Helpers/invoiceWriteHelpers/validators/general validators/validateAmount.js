"use strict";

const { roundNumber } = require("../../../General/roundNumber");

const validateAmount= (value, fieldName, options) => {
  const { isnegativeAllowed = false, decimals = 2 } = options || {};

  // Type validation: only accept string or number
  if (typeof value !== "string" && typeof value !== "number") {
    return {
      isValid: false,
      errorMessage: `[${fieldName}] doit être une chaîne de caractères ou un nombre.`,
    };
  }

  let cleaned = value;

  if (typeof cleaned === "string") {
    cleaned = cleaned.replace(",", ".").replace("€", "").trim();
  }

  if (isNaN(cleaned * 1)) {
    return {
      isValid: false,
      errorMessage: `[${fieldName}] doit être un chiffre.`,
    };
  }

  cleaned = cleaned * 1;

  if (cleaned < 0 && !isnegativeAllowed) {
    return {
      isValid: false,
      errorMessage: `[${fieldName}] ne peut pas être négatif.`,
    };
  }

  return { isValid: true, value: roundNumber(cleaned, decimals) };
};

module.exports = { validateAmount };
