"use strict";

const { findDictValue } = require("../../General/findDictValue");
const { validateAmount } = require("./general validators/validateAmount");

const POSSIBLE_FIELD_NAMES = [
  "mntAcompte",
  "acompte",
  "totalAcompte",
  "mntAccompte",
  "accompte",
  "totalAccompte",
];

const validateAcompte = (body) => {
  const fieldName = "mntAcompte";

  const [value] = findDictValue(POSSIBLE_FIELD_NAMES, body);

  // If not provided, default to "0"
  if (!value) {
    return {
      isValid: true,
      values: { mntAcompte: "0" },
    };
  }
  
  const validateResult = validateAmount(value, fieldName);

  if (!validateResult.isValid) return validateResult;

  return {
    isValid: true,
    values: { mntAcompte: validateResult.value.toString() },
  };
};

module.exports = { validateAcompte };
