"use strict";

const { findDictValue } = require("../../../General/findDictValue");
const { getFieldName } = require("./getFieldName");
const { validateStringField } = require("../general validators/validateString");

const POSSIBLE_FIELD_NAMES = ["unité", "unite", "unity", "type"];
const VALID_UNIT_TYPES = ["HEURE", "FORFAIT"];

/**
 * Validates unit type (unite: HEURE or FORFAIT)
 */
const validateUnitType = (prestation, prestationNumber) => {
  const fieldName = getFieldName("unite", prestationNumber);

  const result = findDictValue(POSSIBLE_FIELD_NAMES, prestation);

  if (!result) {
    return {
      isValid: false,
      errorMessage: `[${fieldName}] n'est pas défini(e)`,
    };
  }

  const [value] = result;

  // Type validation
  const typeValidation = validateStringField(value, fieldName, true);
  if (!typeValidation.isValid) {
    return typeValidation;
  }

  // Normalize: uppercase and remove trailing 'S'
  const cleaned = value.toString().toUpperCase().replace(/S$/g, "");

  // Check if value is in allowed enum
  if (!VALID_UNIT_TYPES.includes(cleaned)) {
    return {
      isValid: false,
      errorMessage: `[${fieldName}] doit être "HEURE" ou "FORFAIT"`,
    };
  }

  return {
    isValid: true,
    values: { unite: cleaned },
  };
};

module.exports = { validateUnitType };
