"use strict";

const { findAndValidateField } = require("./validateInvoiceFieldUtils");

/**
 * Validates activity code (codeNature)
 */
const validateActivityCode = (prestation, prestationNumber) => {
  const fieldName = `Prestation ${prestationNumber}][codeNature`;
  
  const findResult = findAndValidateField(
    ["codeNature", "activity", "activite", "activité", "type", "nature"],
    prestation,
    fieldName
  );

  if (!findResult.isValid) return findResult;

  // TODO: Integrate with urssafActivite lookup
  const codeNature = findResult.value;

  return {
    isValid: true,
    values: { codeNature },
  };
};

module.exports = { validateActivityCode };
