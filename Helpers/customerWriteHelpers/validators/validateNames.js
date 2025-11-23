"use strict";

const { nameFormat } = require("../nameFormat");

const validateNameField = (value, fieldName, isRequired = true) => {
  // Required field validation
  if (!value) {
    if (isRequired) {
      return {
        isValid: false,
        errorMessage: `[${fieldName}] n'est pas défini`,
      };
    }
    return { isValid: true, value: null }; // Optional field, no value
  }

  // Type safety check - names must be strings only
  if (typeof value !== "string") {
    return {
      isValid: false,
      errorMessage: `[${fieldName}] doit être une chaîne de caractères`,
    };
  }

  // Normalize the name using nameFormat
  const normalizedName = nameFormat(value, false, false);

  // Check if nameFormat returned empty string (happens when input has no valid name characters)
  if (!normalizedName || normalizedName.trim().length === 0) {
    return {
      isValid: false,
      errorMessage: `[${fieldName}] ne contient aucun caractère valide pour un nom`,
    };
  }

  return { isValid: true, value: normalizedName };
};

const validateNames = (body) => {
  const values = {};

  // Validate nomNaissance (required)
  const nomNaissanceResult = validateNameField(
    body.nomNaissance,
    "nomNaissance",
    true
  );
  if (!nomNaissanceResult.isValid) return nomNaissanceResult;
  values.nomNaissance = nomNaissanceResult.value;

  // Validate nomUsage (optional, defaults to nomNaissance)
  if (body.nomUsage) {
    const nomUsageResult = validateNameField(body.nomUsage, "nomUsage", false);
    if (!nomUsageResult.isValid) return nomUsageResult;
    values.nomUsage = nomUsageResult.value;
  } else {
    // Default to nomNaissance if not provided
    values.nomUsage = values.nomNaissance;
  }

  // Validate prenoms (required)
  const prenomsResult = validateNameField(body.prenoms, "prenoms", true);
  if (!prenomsResult.isValid) return prenomsResult;
  values.prenoms = prenomsResult.value;

  return { isValid: true, values };
};

module.exports = { validateNames };
