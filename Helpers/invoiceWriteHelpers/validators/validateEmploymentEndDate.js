"use strict";

const { dateFormatUrssaf } = require("../../formatters/dateFormatUrssaf");

/**
 * Validates employment end date with fallback logic
 */
const validateEmploymentEndDate = (body, validatedData) => {
  const fieldName = "dateFinEmploi";

  if (body.dateFinEmploi !== undefined) {
    const formatted = dateFormatUrssaf(body.dateFinEmploi);

    if (!formatted) {
      return {
        isValid: false,
        errorMessage: `[${fieldName}] format de date invalide (reçu: ${body.dateFinEmploi})`,
      };
    }

    return {
      isValid: true,
      values: { dateFinEmploi: formatted },
    };
  }

  // Fallback: use dateDebutEmploi or dateFacture
  const fallbackDate = validatedData.dateDebutEmploi || body.dateFacture;

  return {
    isValid: true,
    values: { dateFinEmploi: fallbackDate },
  };
};

module.exports = { validateEmploymentEndDate };
