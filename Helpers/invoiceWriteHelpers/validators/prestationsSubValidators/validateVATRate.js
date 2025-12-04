"use strict";

const { findDictValue } = require("../../../General/findDictValue");
const {
  getFieldName,
} = require("./getFieldName");
const {
  validateStringField,
} = require("../general validators/validateString");

const POSSIBLE_FIELD_NAMES = ["tauxTVA", "tva", "TVA"];

const validateVATRate = (prestation, prestationNumber) => {
  const fieldName = getFieldName("tauxTVA", prestationNumber);

  const result = findDictValue(POSSIBLE_FIELD_NAMES, prestation);

  if (!result) {
    return {
      isValid: false,
      errorMessage: `[${fieldName}] n'est pas défini(e)`,
    };
  }

  const [value] = result;

  // Type validation
  const typeValidation = validateStringField(value, fieldName, true);
  if (!typeValidation.isValid) {
    return typeValidation;
  }

  let tauxTVA = value;

  // Handle string conversion
  if (typeof tauxTVA === "string") {
    // Replace comma with dot
    tauxTVA = tauxTVA.replace(",", ".");

    // Handle percentage symbol (e.g., "20%" → 0.20)
    if (tauxTVA.includes("%")) {
      tauxTVA = (tauxTVA.replace("%", "") * 1) / 100;
    }
  }

  // Convert to number
  tauxTVA = tauxTVA * 1;

  // Validate it's a number
  if (isNaN(tauxTVA)) {
    return {
      isValid: false,
      errorMessage: `[${fieldName}] n'est pas un nombre valide`,
    };
  }

  // Validate it's not greater than 100% (1.0 in decimal form)
  if (tauxTVA > 1) {
    return {
      isValid: false,
      errorMessage: `[${fieldName}] supérieur à 100%`,
    };
  }

  // Validate it's not negative
  if (tauxTVA < 0) {
    return {
      isValid: false,
      errorMessage: `[${fieldName}] ne peut pas être négatif`,
    };
  }

  return {
    isValid: true,
    values: { tauxTVA },
  };
};

const main = () => {
  const infos = validateVATRate({ tva: "-10%" }, 1);
  console.log(infos);
};

main();

module.exports = { validateVATRate };
