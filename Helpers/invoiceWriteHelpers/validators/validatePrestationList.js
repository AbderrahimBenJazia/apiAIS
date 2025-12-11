"use strict";

const { findDictValue } = require("../../General/findDictValue");
const { roundNumber } = require("../../General/roundNumber");
const { validateSinglePrestation } = require("./validateSinglePrestation");

const POSSIBLE_FIELD_NAMES = [
  "prestationListe",
  "prestationList",
  "prestations",
];

const validatePrestationList = (body) => {
  const [prestationListe] = findDictValue(POSSIBLE_FIELD_NAMES, body);

  if (!Array.isArray(prestationListe)) {
    return {
      isValid: false,
      errorMessage: "[prestationListe] doit être un tableau",
    };
  }

  if (prestationListe.length === 0) {
    return {
      isValid: false,
      errorMessage: "[prestationListe] ne peut pas être vide",
    };
  }

  if (prestationListe.length > 10) {
    return {
      isValid: false,
      errorMessage:
        "[prestationListe] Le nombre maximum de prestations est de 10",
    };
  }

  const validatedData = Object.create(null);

  let counter = 1;

  validatedData.prestations = [];
  let totalHt = 0;
  let totalTtc = 0;
  for (const prestation of prestationListe) {
    const checkPrestation = validateSinglePrestation(prestation, counter);
    if (!checkPrestation.isValid) return checkPrestation;

    validatedData.prestations.push(checkPrestation.values);
    counter++;
    totalHt = roundNumber(totalHt + checkPrestation.values.mntPrestationHT, 2);
    totalTtc = roundNumber(totalTtc + checkPrestation.values.mntPrestationTTC, 2);
  }

  return {
    isValid: true,
    values: validatedData,
    totals: { totalHt, totalTtc },
  };
};

module.exports = { validatePrestationList };
