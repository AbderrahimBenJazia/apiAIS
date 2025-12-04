"use strict";

const { findDictValue } = require("../../General/findDictValue");

const POSSIBLE_FIELD_NAMES = [
  "prestationListe",
  "prestationList",
  "prestations",
];

const validatePrestationList = (body) => {
  const [prestationListe, key] = findDictValue(POSSIBLE_FIELD_NAMES, body);

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

  return { isValid: true, data: validatedData };
};

module.exports = { validatePrestationList };
