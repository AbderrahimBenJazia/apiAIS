"use strict";

const { findDictValue } = require("../../General/findDictValue");

/**
 * Validates that prestationListe exists and is an array
 */
const validatePrestationList = (body) => {
  const [prestationListe, key] = findDictValue(
    ["prestationListe", "prestationList", "prestations"],
    body
  );

  if (!Array.isArray(prestationListe)) {
    return {
      isValid: false,
      errorMessage: "[prestationListe] doit être un tableau",
    };
  }

  return {
    isValid: true,
    values: { prestationList: prestationListe },
  };
};

module.exports = { validatePrestationList };
