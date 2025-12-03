"use strict";

const { findAndValidateField } = require("./validateInvoiceFieldUtils");

/**
 * Validates worker identifier (complement2/intervenant)
 * Must be 12 or 17 alphanumeric characters (SAP or SIR number)
 */
const validateWorkerIdentifier = (prestation, prestationNumber) => {
  const fieldName = `Prestation ${prestationNumber}][intervenant/complement2`;
  
  const findResult = findAndValidateField(
    ["complement2", "intervenant"],
    prestation,
    fieldName,
    false // optional
  );

  if (!findResult.value) {
    return { isValid: true, values: {} };
  }

  // Clean: uppercase and remove non-alphanumeric
  const cleaned = findResult.value
    .toString()
    .toUpperCase()
    .replace(/[^0-9A-Z]/g, "");

  if (cleaned.length !== 12 && cleaned.length !== 17) {
    return {
      isValid: false,
      errorMessage: `[${fieldName}] doit être égale au numéro SAP de l'intervenant (12 caractères) ou le numéro SIR de son SIRET (17 caractères) (reçu: ${prestation[findResult.key]})`,
    };
  }

  return {
    isValid: true,
    values: { complement2: cleaned },
  };
};

module.exports = { validateWorkerIdentifier };
