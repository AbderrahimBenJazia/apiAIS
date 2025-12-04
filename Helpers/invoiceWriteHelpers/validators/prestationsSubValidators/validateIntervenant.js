"use strict";

const { findDictValue } = require("../../../General/findDictValue");
const { getFieldName } = require("./getFieldName");
const { validateStringField } = require("../general validators/validateString");

const POSSIBLE_FIELD_NAMES = [
  "complement2",
  "intervenant",
  "worker",
  "identifiant",
];

const validateIntervenant = (prestation, prestationNumber) => {
  const fieldName = getFieldName("intervenant", prestationNumber);

  const result = findDictValue(POSSIBLE_FIELD_NAMES, prestation);

  // Optional field - return empty if not found
  if (!result) {
    return { isValid: true, values: {} };
  }

  const [value] = result;

  // Type validation
  const typeValidation = validateStringField(value, fieldName, true);
  if (!typeValidation.isValid) {
    return typeValidation;
  }

  // Clean: uppercase and remove spaces/dashes
  const cleaned = value.toString().toUpperCase().replace(/[\s-]/g, "");

  // Validate format: SIR + 14 digits OR SAP + 9 digits
  const sirPattern = /^SIR\d{14}$/; // SIR + SIRET (14 digits)
  const sapPattern = /^SAP\d{9}$/; // SAP + SIREN (9 digits)

  if (!sirPattern.test(cleaned) && !sapPattern.test(cleaned)) {
    return {
      isValid: false,
      errorMessage: `[${fieldName}] doit être au format SIR suivi de 14 chiffres (SIRET) ou SAP suivi de 9 chiffres (SIREN)`,
    };
  }

  return {
    isValid: true,
    values: { complement2: cleaned },
  };
};

module.exports = { validateIntervenant };
