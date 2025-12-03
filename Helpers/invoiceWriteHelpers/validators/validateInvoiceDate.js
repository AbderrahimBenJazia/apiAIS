"use strict";

const { findDictValue } = require("../../General/findDictValue");
const { dateFormatUrssaf } = require("../../formatters/dateFormatUrssaf");

/**
 * Validates invoice date (dateFacture)
 */
const validateInvoiceDate = (body) => {
  const fieldName = "dateFacture";
  
  const [dateFacture] = findDictValue(["dateFacture"], body);

  if (!dateFacture) {
    return {
      isValid: false,
      errorMessage: `[${fieldName}] n'est pas défini(e)`,
    };
  }

  const formatted = dateFormatUrssaf(dateFacture);
  
  if (!formatted) {
    return {
      isValid: false,
      errorMessage: `[${fieldName}] format de date invalide (reçu: ${dateFacture})`,
    };
  }

  return {
    isValid: true,
    values: { dateFacture: formatted },
  };
};

module.exports = { validateInvoiceDate };
