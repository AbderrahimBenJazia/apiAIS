"use strict";

const { findDictValue } = require("../../General/findDictValue");
const { validateStringField } = require("./general validators/validateString");

const POSSIBLE_FIELD_NAMES = [
  "numFactureTiers",
  "facture",
  "numeroFacture",
  "numero",
];

const validateInvoiceNumber = (body) => {
  const fieldName = "numFactureTiers";

  // Find the field value (throws if not found)
  const [value] = findDictValue(POSSIBLE_FIELD_NAMES, body);

  // Validate type and clean
  const validateResult = validateStringField(value, fieldName, true);

  if (!validateResult.isValid) return validateResult;

  // Remove all spaces
  const cleaned = validateResult.value.replace(/\s+/g, "");

  if (cleaned === "") {
    return {
      isValid: false,
      errorMessage: `[${fieldName}] ne peut être vide après suppression des espaces`,
    };
  }

  return {
    isValid: true,
    values: { numFactureTiers: cleaned },
  };
};

module.exports = { validateInvoiceNumber };
