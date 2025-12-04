"use strict";

const getFieldName = (fieldName, prestationNumber) => {
  return `[Prestation ${prestationNumber}] [${fieldName}]`;
};

module.exports = { getFieldName };
