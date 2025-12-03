"use strict";

const { findDictValue } = require("../../General/findDictValue");

/**
 * Shared utility for invoice field validation
 */

const findAndValidateField = (keyList, body, fieldName, required = true) => {
  const [value, key] = findDictValue(keyList, body, required);

  if (!value && !required) {
    return { isValid: true, value: null, key: null };
  }

  if (!value) {
    return {
      isValid: false,
      errorMessage: `[${fieldName}] n'est pas défini(e)`,
    };
  }

  return { isValid: true, value, key };
};

const validateNumericField = (value, fieldName, originalValue) => {
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
      errorMessage: `[${fieldName}] doit être un chiffre (reçu: ${originalValue})`,
    };
  }

  return { isValid: true, value: cleaned * 1 };
};

const validateStringField = (value, fieldName, options = {}) => {
  const { allowEmpty = false, maxLength = null } = options;

  // Type validation: only accept string or number
  if (typeof value !== "string" && typeof value !== "number") {
    return {
      isValid: false,
      errorMessage: `[${fieldName}] doit être une chaîne de caractères ou un nombre.`,
    };
  }

  if (!value && !allowEmpty) {
    return {
      isValid: false,
      errorMessage: `[${fieldName}] ne peut être vide`,
    };
  }

  const stringValue = value.toString().trim();

  if (!allowEmpty && stringValue === "") {
    return {
      isValid: false,
      errorMessage: `[${fieldName}] ne peut être vide`,
    };
  }

  if (maxLength && stringValue.length > maxLength) {
    return {
      isValid: false,
      errorMessage: `[${fieldName}] ne peut dépasser ${maxLength} caractères`,
    };
  }

  return { isValid: true, value: stringValue };
};

const validateEnumField = (value, fieldName, allowedValues, originalValue) => {
  // Type validation: only accept string or number
  if (typeof value !== "string" && typeof value !== "number") {
    return {
      isValid: false,
      errorMessage: `[${fieldName}] doit être une chaîne de caractères ou un nombre.`,
    };
  }

  const upperValue = value.toString().toUpperCase();

  if (!allowedValues.includes(upperValue)) {
    return {
      isValid: false,
      errorMessage: `[${fieldName}] doit être parmi [${allowedValues.join(", ")}] (reçu: ${originalValue})`,
    };
  }

  return { isValid: true, value: upperValue };
};

const validatePercentageField = (value, fieldName, originalValue) => {
  // Type validation: only accept string or number
  if (typeof value !== "string" && typeof value !== "number") {
    return {
      isValid: false,
      errorMessage: `[${fieldName}] doit être une chaîne de caractères ou un nombre.`,
    };
  }

  let cleaned = value;

  if (typeof cleaned === "string") {
    cleaned = cleaned.replace(",", ".").trim();
    if (cleaned.includes("%")) {
      cleaned = (cleaned.replace("%", "") * 1) / 100;
    }
  }

  if (isNaN(cleaned)) {
    return {
      isValid: false,
      errorMessage: `[${fieldName}] doit être un nombre (reçu: ${originalValue})`,
    };
  }

  if (cleaned > 1) {
    return {
      isValid: false,
      errorMessage: `[${fieldName}] ne peut dépasser 100% (reçu: ${originalValue})`,
    };
  }

  return { isValid: true, value: cleaned };
};

module.exports = {
  findAndValidateField,
  validateNumericField,
  validateStringField,
  validateEnumField,
  validatePercentageField,
};
