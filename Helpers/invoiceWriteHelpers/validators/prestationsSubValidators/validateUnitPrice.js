"use strict";

const { findDictValue } = require("../../../General/findDictValue");
const { getFieldName } = require("./getFieldName");
const { validateAmount } = require("../general validators/validateAmount");

const POSSIBLE_FIELD_NAMES_HT = [
  "mntUnitaireHT",
  "mntUnitaireht",
  "montantHT",
  "prixHT",
];
const POSSIBLE_FIELD_NAMES_TTC = [
  "mntUnitaireTTC",
  "mntUnitairettc",
  "montantTTC",
  "prixTTC",
];

/**
 * Validates unit prices (mntUnitaireHT and mntUnitaireTTC)
 * At least one must be provided
 */
const validateUnitPrice = (prestation, prestationNumber, tauxTVA) => {
  const fieldName = getFieldName("mntUnitaire", prestationNumber);

  // Try to find HT
  const htResult = findDictValue(POSSIBLE_FIELD_NAMES_HT, prestation);
  const htValue = htResult ? htResult[0] : null;

  // Try to find TTC
  const ttcResult = findDictValue(POSSIBLE_FIELD_NAMES_TTC, prestation);
  const ttcValue = ttcResult ? ttcResult[0] : null;

  // At least one must be provided
  if (htValue === null && ttcValue === null) {
    return {
      isValid: false,
      errorMessage: `[${fieldName}] Le montant unitaire TTC ou HT doit être indiqué`,
    };
  }

  const values = {};

  // HT provided
  if (htValue !== null) {
    const validateHT = validateAmount(htValue, `${fieldName}[HT]`, {
      decimals: 3,
    });

    if (!validateHT.isValid) return validateHT;

    values.mntUnitaireHT = validateHT.value;
    values.mntUnitaireTTC = validateHT.value * (1 + tauxTVA);
  }
  // TTC provided
  else {
    const validateTTC = validateAmount(ttcValue, `${fieldName}[TTC]`, {
      decimals: 3,
    });
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
