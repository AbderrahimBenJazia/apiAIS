"use strict";

const { findDictValue } = require("../../General/findDictValue");

/**
 * Validates invoice totals (HT and TTC) against prestation sums
 * Requires prestationList to be validated first
 */
const validateInvoiceTotals = (body, prestationList) => {
  const values = {};

  // 1. mntFactureHT (optional - cross-check)
  const [mntFactureHT, htKey] = findDictValue(
    [
      "mntFactureHT",
      "mntFactureHt",
      "mntFactureht",
      "totalHT",
      "totalHt",
      "totalht",
    ],
    body,
    false
  );

  if (mntFactureHT) {
    let cleaned = mntFactureHT;
    if (typeof cleaned === "string") {
      cleaned = cleaned.replace(",", ".").replace("€", "") * 1;
    }
    if (isNaN(cleaned)) {
      return {
        isValid: false,
        errorMessage: `[mntFactureHT] doit être un nombre (ici ${body[htKey]})`,
      };
    }

    // Cross-check with sum of prestations
    let calculatedTotal = 0;
    for (const prestation of prestationList) {
      calculatedTotal += prestation.mntUnitaireHT * prestation.quantite;
    }

    if (Math.abs(calculatedTotal - cleaned) > 1) {
      return {
        isValid: false,
        errorMessage: `[mntFactureHT] (${cleaned.toFixed(2)}) est différent de la somme des prestations (${calculatedTotal.toFixed(2)})`,
      };
    }

    values.mntFactureHT = cleaned;
  }

  // 2. mntFactureTTC (optional - cross-check)
  const [mntFactureTTC, ttcKey] = findDictValue(
    [
      "mntFactureTTC",
      "mntFactureTtc",
      "mntFacturettc",
      "totalTTC",
      "totalTtc",
      "totalttc",
    ],
    body,
    false
  );

  if (mntFactureTTC) {
    let cleaned = mntFactureTTC;
    if (typeof cleaned === "string") {
      cleaned = cleaned.replace(",", ".").replace("€", "") * 1;
    }
    if (isNaN(cleaned)) {
      return {
        isValid: false,
        errorMessage: `[mntFactureTTC] doit être un nombre (ici ${body[ttcKey]})`,
      };
    }

    // Cross-check with sum of prestations
    let calculatedTotal = 0;
    for (const prestation of prestationList) {
      calculatedTotal += prestation.mntUnitaireTTC * prestation.quantite;
    }

    if (Math.abs(calculatedTotal - cleaned) > 0.05) {
      return {
        isValid: false,
        errorMessage: `[mntFactureTTC] (${cleaned.toFixed(2)}) est différent de la somme des prestations (${calculatedTotal.toFixed(2)})`,
      };
    }

    values.mntFactureTTC = cleaned;
  }

  return { isValid: true, values };
};

module.exports = { validateInvoiceTotals };
