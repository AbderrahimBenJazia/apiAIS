"use strict";

const { findAndValidateField, validateNumericField } = require("./validateInvoiceFieldUtils");

/**
 * Validates quantity (quantite)
 */
const validateQuantity = (prestation, prestationNumber) => {
  const fieldName = `Prestation ${prestationNumber}][quantite`;
  
  const findResult = findAndValidateField(
    ["quantite", "qte", "nombre", "nb"],
    prestation,
    fieldName
  );

  if (!findResult.isValid) return findResult;

  const validateResult = validateNumericField(
    findResult.value,
    fieldName,
    prestation[findResult.key]
  );

  if (!validateResult.isValid) return validateResult;

  return {
    isValid: true,
    values: { quantite: validateResult.value },
  };
};

module.exports = { validateQuantity };
