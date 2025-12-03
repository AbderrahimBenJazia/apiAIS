"use strict";

const { findAndValidateField, validateNumericField } = require("./validateInvoiceFieldUtils");

/**
 * Validates down payment amount (mntAcompte)
 */
const validateDownPayment = (body) => {
  const fieldName = "mntAcompte";
  
  const findResult = findAndValidateField(
    [
      "mntAcompte",
      "acompte",
      "totalAcompte",
      "mntAccompte",
      "accompte",
      "totalAccompte",
    ],
    body,
    fieldName,
    false // optional
  );

  // If not provided, default to "0"
  if (!findResult.value) {
    return {
      isValid: true,
      values: { mntAcompte: "0" },
    };
  }

  const validateResult = validateNumericField(
    findResult.value,
    fieldName,
    body[findResult.key]
  );

  if (!validateResult.isValid) return validateResult;

  return {
    isValid: true,
    values: { mntAcompte: validateResult.value.toString() },
  };
};

module.exports = { validateDownPayment };
