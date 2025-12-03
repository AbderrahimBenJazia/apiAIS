"use strict";

const { dateFormatUrssaf } = require("../../formatters/dateFormatUrssaf");

/**
 * Validates down payment date with fallback to employment start date
 */
const validateDownPaymentDate = (body, validatedData) => {
  const fieldName = "dateVersementAcompte";

  if (body.dateVersementAcompte !== undefined) {
    const formatted = dateFormatUrssaf(body.dateVersementAcompte);

    if (!formatted) {
      return {
        isValid: false,
        errorMessage: `[${fieldName}] format de date invalide (reçu: ${body.dateVersementAcompte})`,
      };
    }

    return {
      isValid: true,
      values: { dateVersementAcompte: formatted },
    };
  }

  // Fallback: use dateDebutEmploi
  return {
    isValid: true,
    values: { dateVersementAcompte: validatedData.dateDebutEmploi },
  };
};

module.exports = { validateDownPaymentDate };
