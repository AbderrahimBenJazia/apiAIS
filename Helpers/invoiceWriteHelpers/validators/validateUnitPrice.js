"use strict";

const { findAndValidateField, validateNumericField } = require("./validateInvoiceFieldUtils");

/**
 * Validates unit prices (mntUnitaireHT and mntUnitaireTTC)
 * At least one must be provided
 */
const validateUnitPrice = (prestation, prestationNumber, tauxTVA) => {
  const fieldName = `Prestation ${prestationNumber}][mntUnitaireHT/TTC`;

  // Try to find HT
  const htResult = findAndValidateField(
    ["mntUnitaireHT", "mntUnitaireht"],
    prestation,
    fieldName,
    false
  );

  // Try to find TTC
  const ttcResult = findAndValidateField(
    ["mntUnitaireTTC", "mntUnitairettc"],
    prestation,
    fieldName,
    false
  );

  // At least one must be provided
  if (!htResult.value && !ttcResult.value) {
    return {
      isValid: false,
      errorMessage: `[${fieldName}] Le montant unitaire TTC ou HT doit être indiqué`,
    };
  }

  const values = {};

  // HT provided
  if (htResult.value) {
    const validateHT = validateNumericField(
      htResult.value,
      `${fieldName}[HT]`,
      prestation[htResult.key]
    );

    if (!validateHT.isValid) return validateHT;

    values.mntUnitaireHT = validateHT.value;
    values.mntUnitaireTTC = validateHT.value * (1 + tauxTVA);
  }
  // TTC provided
  else {
    const validateTTC = validateNumericField(
      ttcResult.value,
      `${fieldName}[TTC]`,
      prestation[ttcResult.key]
    );

    if (!validateTTC.isValid) return validateTTC;

    values.mntUnitaireTTC = validateTTC.value;
    values.mntUnitaireHT = validateTTC.value / (1 + tauxTVA);
  }

  return {
    isValid: true,
    values,
  };
};

module.exports = { validateUnitPrice };
