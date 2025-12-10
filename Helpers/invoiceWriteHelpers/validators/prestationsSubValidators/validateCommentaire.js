"use strict";

const { getFieldName } = require("./getFieldName");
const { findDictValue } = require("../../../General/findDictValue");
const { validateStringField } = require("../general validators/validateString");

const POSSIBLE_FIELD_NAMES = ["complement1", "commentaire"];

const validateCommentaire = (prestation, prestationNumber) => {
  const fieldName = getFieldName("commentaire", prestationNumber);

  const result = findDictValue(POSSIBLE_FIELD_NAMES, prestation);

  const [value] = result;

  const validateResult = validateStringField(value, fieldName);

  // Currently, no specific validation rules for commentaire
  return validateResult;
};

module.exports = { validateCommentaire };
