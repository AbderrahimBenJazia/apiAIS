"use strict";

const { findDictValue } = require("../../../General/findDictValue");
const { getFieldName } = require("./getFieldName");
const { validateAmount } = require("../general validators/validateAmount");

const POSSIBLE_FIELD_NAMES = ["quantite", "qte", "nombre", "nb"];

const validateQuantity = (prestation, prestationNumber) => {
  const fieldName = getFieldName("quantite", prestationNumber);

  const result = findDictValue(POSSIBLE_FIELD_NAMES, prestation);

  if (!result) {
    return {
      isValid: false,
      errorMessage: `[${fieldName}] n'est pas défini(e)`,
    };
  }

  const [value] = result;

  const validateResult = validateAmount(value, fieldName, { decimals: 3 });

  if (!validateResult.isValid) return validateResult;

  return {
    isValid: true,
    values: { quantite: validateResult.value },
  };
};

module.exports = { validateQuantity };
