"use strict";

const { validateAmount } = require("./general validators/validateAmount");

const { findDictValue } = require("../../General/findDictValue");

const POSSIBLE_FIELD_NAMES_HT = [
  "mntFactureHT",
  "mntFactureHt",
  "mntFactureht",
  "totalHT",
  "totalHt",
  "totalht",
];
const POSSIBLE_FIELD_NAMES_TTC = [
  "mntFactureTTC",
  "mntFactureTtc",
  "mntFacturettc",
  "totalTTC",
  "totalTtc",
  "totalttc",
];

const TOLERANCE = 0.05;

/**
 * Helper to validate a single total (HT or TTC)
 */
const validateSingleTotal = (providedValue, calculatedValue, fieldName) => {
  if (!providedValue) {
    return { isValid: true, value: calculatedValue };
  }

  const checkAmount = validateAmount(providedValue, fieldName);
  if (!checkAmount.isValid) return checkAmount;

  if (Math.abs(checkAmount.value - calculatedValue) > TOLERANCE) {
    return {
      isValid: false,
      errorMessage: `Le montant ${fieldName} fourni ne correspond pas au total des prestations calculé.`,
    };
  }

  return { isValid: true, value: checkAmount.value };
};

const validateInvoiceTotals = (body, calculatedTotals) => {
  const htResult = findDictValue(POSSIBLE_FIELD_NAMES_HT, body);
  const ttcResult = findDictValue(POSSIBLE_FIELD_NAMES_TTC, body);

  const [mntFactureHT] = htResult;
  const [mntFactureTTC] = ttcResult;

  const { totalHt, totalTtc } = calculatedTotals;

  // If no totals provided, use calculated values
  if (!mntFactureHT && !mntFactureTTC) {
    return {
      isValid: true,
      values: { mntFactureHT: totalHt, mntFactureTTC: totalTtc },
    };
  }

  // Validate HT
  const htValidation = validateSingleTotal(mntFactureHT, totalHt, "HT");
  if (!htValidation.isValid) return htValidation;

  // Validate TTC
  const ttcValidation = validateSingleTotal(mntFactureTTC, totalTtc, "TTC");
  if (!ttcValidation.isValid) return ttcValidation;

  return {
    isValid: true,
    values: {
      mntFactureHT: htValidation.value,
      mntFactureTTC: ttcValidation.value,
    },
  };
};

module.exports = { validateInvoiceTotals };
