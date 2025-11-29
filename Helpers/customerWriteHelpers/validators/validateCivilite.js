"use strict";

const { validateField } = require("./validateFieldUtils");

// Constants for civilité validation
const CIVILITE = {
  MONSIEUR: {
    code: "1",
    variants: ["1", "mr", "m", "monsieur"],
  },
  MADAME: {
    code: "2",
    variants: ["2", "mme", "madame", "mlle", "mle", "mademoiselle"],
  },
};

// Create lookup map for better performance
const CIVILITE_LOOKUP = new Map();
CIVILITE.MONSIEUR.variants.forEach((variant) =>
  CIVILITE_LOOKUP.set(variant, "1")
);
CIVILITE.MADAME.variants.forEach((variant) =>
  CIVILITE_LOOKUP.set(variant, "2")
);

const validateCivilite = (body) => {
  const civilite = body.civilite;
  // Use shared field validation
  const fieldValidation = validateField(civilite, "civilite", true);
  if (!fieldValidation.isValid) return fieldValidation;

  const normalized = String(civilite).toLowerCase().replace(/[\s.]/g, "");

  const result = CIVILITE_LOOKUP.get(normalized);

  if (result) {
    return { isValid: true, values: { civilite: result } };
  }

  return {
    isValid: false,
    errorMessage:
      "[civilite] invalide. Valeurs acceptées: 1/Mr/M/Monsieur (homme) ou 2/Mme/Mlle/Madame/Mademoiselle (femme)",
  };
};

module.exports = { validateCivilite };
