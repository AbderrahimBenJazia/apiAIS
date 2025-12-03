"use strict";

const { findAndValidateField, validateEnumField } = require("./validateInvoiceFieldUtils");

/**
 * Validates unit type (unite: HEURE or FORFAIT)
 */
const validateUnitType = (prestation, prestationNumber) => {
  const fieldName = `Prestation ${prestationNumber}][unite`;
  
  const findResult = findAndValidateField(
    ["unité", "unite", "unity", "nombre"],
    prestation,
    fieldName
  );

  if (!findResult.isValid) return findResult;

  // Normalize: uppercase and remove trailing 'S'
  const cleaned = findResult.value.toString().toUpperCase().replace("S", "");

  const validateResult = validateEnumField(
    cleaned,
    fieldName,
    ["HEURE", "FORFAIT"],
    prestation[findResult.key]
  );

  if (!validateResult.isValid) return validateResult;

  return {
    isValid: true,
    values: { unite: validateResult.value },
  };
};

module.exports = { validateUnitType };
