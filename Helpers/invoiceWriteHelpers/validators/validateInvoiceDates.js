"use strict";

const { validateDate } = require("./general validators/validateDate");
const { findDictValue } = require("../../General/findDictValue");

/**
 * Validates invoice dates with fallback logic and constraints
 * - dateFacture: Must not be in future
 * - dateDebutEmploi: Defaults to dateFacture, must not be in future
 * - dateFinEmploi: Defaults to dateDebutEmploi, must be >= dateDebutEmploi
 * - dateVersementAcompte: Defaults to dateDebutEmploi, must be between dateDebutEmploi and dateFinEmploi
 */
const validateInvoiceDates = (body) => {
  // Validate dateFacture (required)
  const [dateFacture] = findDictValue(["dateFacture"], body);
  const dateFactureResult = validateDate(dateFacture, "dateFacture", {
    allowFuture: false,
  });
  const validatedDateFacture = dateFactureResult.value;

  if (!dateFactureResult.isValid) {
    return {
      isValid: false,
      errorMessage: dateFactureResult.errorMessage,
    };
  }

  // Validate dateDebutEmploi (defaults to dateFacture)
  const [dateDebutEmploi] = findDictValue(["dateDebutEmploi"], body);
  const dateDebutEmploiResult = validateDate(
    dateDebutEmploi,
    "dateDebutEmploi",
    {
      allowFuture: false,
      defaultValue: validatedDateFacture,
    }
  );

  if (!dateDebutEmploiResult.isValid) {
    return {
      isValid: false,
      errorMessage: dateDebutEmploiResult.errorMessage,
    };
  }

  const validatedDateDebutEmploi = dateDebutEmploiResult.value;

  // Validate dateFinEmploi (defaults to dateDebutEmploi, must be >= dateDebutEmploi)
  const [dateFinEmploi] = findDictValue(["dateFinEmploi"], body);
  const dateFinEmploiResult = validateDate(dateFinEmploi, "dateFinEmploi", {
    defaultValue: validatedDateDebutEmploi,
    allowFuture: false,
    min: validatedDateDebutEmploi,
    minErrorMessage:
      "[dateFinEmploi] doit être postérieure ou égale à [dateDebutEmploi].",
  });

  if (!dateFinEmploiResult.isValid) {
    return {
      isValid: false,
      errorMessage: dateFinEmploiResult.errorMessage,
    };
  }

  // Validate dateVersementAcompte (defaults to dateDebutEmploi, must be between start and end)
  const [dateVersementAcompte] = findDictValue(["dateVersementAcompte"], body);
  const dateVersementAcompteResult = validateDate(
    dateVersementAcompte,
    "dateVersementAcompte",
    {
      defaultValue: validatedDateDebutEmploi,
      allowFuture: false,
    }
  );

  if (!dateVersementAcompteResult.isValid) {
    return {
      isValid: false,
      errorMessage: dateVersementAcompteResult.errorMessage,
    };
  }

  return {
    isValid: true,
    values: {
      dateFacture: validatedDateFacture,
      dateDebutEmploi: validatedDateDebutEmploi,
      dateFinEmploi: dateFinEmploiResult.value,
      dateVersementAcompte: dateVersementAcompteResult.value,
    },
  };
};

module.exports = { validateInvoiceDates };
