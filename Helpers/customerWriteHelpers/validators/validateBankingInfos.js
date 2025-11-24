"use strict";

const { nameFormat } = require("../nameFormat");
const { validateField } = require('./validateFieldUtils');

const validateBankingItem = (value, fieldName, regex) => {
  // Use shared field validation
  const fieldValidation = validateField(value, fieldName, true);
  if (!fieldValidation.isValid) return fieldValidation;

  const normalizedValue = String(value)
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");

  if (!regex.test(normalizedValue)) {
    return {
      isValid: false,
      errorMessage: `[${fieldName}] invalide`,
    };
  }

  return { isValid: true, value: normalizedValue };
};

const validateBankingInfos = (body) => {
  const values = {};

  // BIC validation using helper
  const bicResult = validateBankingItem(
    body.bic,
    "bic",
    /^[A-Z]{6}[0-9A-Z]{2}([0-9A-Z]{3})?$/
  );
  if (!bicResult.isValid) return bicResult;
  values.bic = bicResult.value;

  // IBAN validation using helper
  const ibanResult = validateBankingItem(
    body.iban,
    "iban",
    /^[A-Z]{2}[0-9]{2}[A-Z0-9]{11,30}$/
  );
  if (!ibanResult.isValid) return ibanResult;
  values.iban = ibanResult.value;

  // Account holder validation with smart defaults
  let titulaire = body.titulaire;

  // Generate titulaire if not provided
  if (!titulaire) {
    const prefix = body.civilite === "1" ? "Mr. " : "Mme ";
    titulaire = body.nomUsage ? prefix + body.nomUsage : prefix;
  }

  // Type and length validation
  if (typeof titulaire !== "string") {
    return {
      isValid: false,
      errorMessage: "[titulaire] doit être une chaîne de caractères",
    };
  }

  // Truncate if too long (banking systems typically limit to 99 chars)
  if (titulaire.length > 99) {
    titulaire = titulaire.slice(0, 99);
  }

  // Normalize the account holder name
  values.titulaire = nameFormat(titulaire, false, false);

  return { isValid: true, values };
};



module.exports = { validateBankingInfos };
