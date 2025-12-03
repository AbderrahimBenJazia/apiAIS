"use strict";

const { findAndValidateField, validatePercentageField } = require("./validateInvoiceFieldUtils");

/**
 * Validates VAT rate (tauxTVA)
 */
const validateVATRate = (prestation, prestationNumber) => {
  const fieldName = `Prestation ${prestationNumber}][tauxTVA`;
  
  const findResult = findAndValidateField(
    ["tauxTVA", "tva", "TVA"],
    prestation,
    fieldName
  );

  if (!findResult.isValid) return findResult;

  const validateResult = validatePercentageField(
    findResult.value,
    fieldName,
    prestation[findResult.key]
  );

  if (!validateResult.isValid) return validateResult;

  return {
    isValid: true,
    values: { tauxTVA: validateResult.value },
  };
};

module.exports = { validateVATRate };
