"use strict";

const { dateFormatUrssaf } = require("../../formatters/dateFormatUrssaf");

/**
 * Validates employment start date with fallback to invoice date
 */
const validateEmploymentStartDate = (body) => {
  const fieldName = "dateDebutEmploi";

  if (body.dateDebutEmploi === undefined) {
    return {
      isValid: true,
      values: { dateDebutEmploi: body.dateFacture },
    };
  }

  const formatted = dateFormatUrssaf(body.dateDebutEmploi);

  if (!formatted) {
    return {
      isValid: false,
      errorMessage: `[${fieldName}] format de date invalide (reçu: ${body.dateDebutEmploi})`,
    };
  }

  return {
    isValid: true,
    values: { dateDebutEmploi: formatted },
  };
};

module.exports = { validateEmploymentStartDate };
