"use strict";

const { validateField } = require('./validateFieldUtils');

// Contact validation constants and patterns
const CONTACT_PATTERNS = {
  // French mobile phone: starts with 06, 07 or +336, +337
  phone: /^(0|\+33)[67]([0-9]{2}){4}$/,
  email:
    /^[-A-Za-z0-9_]+(\.[-A-Za-z0-9_]+)*@[A-Za-z0-9]+((-|\.)[A-Za-z0-9]+)*\.[A-Za-z]+$/,
};

const CONTACT_LIMITS = {
  emailMaxLength: 254,
};

const validatePhone = (phone) => {
  // Use shared field validation
  const fieldValidation = validateField(phone, "numeroTelephonePortable", false);
  if (!fieldValidation.isValid) return fieldValidation;

  // Normalize phone number
  const normalized = String(phone)
    .replace(/[oO]/g, "0") // Replace letters O with 0
    .replace(/[^0-9+]/g, ""); // Keep only digits and +

  if (!CONTACT_PATTERNS.phone.test(normalized)) {
    return {
      isValid: false,
      errorMessage:
        "[numeroTelephonePortable] format invalide. Formats acceptés: 0612345678, +33612345678",
    };
  }

  return { isValid: true, value: normalized };
};

const validateEmail = (email) => {
  // Use shared field validation
  const fieldValidation = validateField(email, "adresseMail", false);
  if (!fieldValidation.isValid) return fieldValidation;

  // Normalize email address
  const normalized = email
    .replace(/\s/g, "") // Remove spaces
    .replace(/^[.'"-]+/, "") // Remove leading special chars
    .replace(/[.'"-]+$/, "") // Remove trailing special chars
    .toLowerCase();

  // Length check first (more efficient)
  if (normalized.length > CONTACT_LIMITS.emailMaxLength) {
    return {
      isValid: false,
      errorMessage: `[adresseMail] trop longue (max ${CONTACT_LIMITS.emailMaxLength} caractères)`,
    };
  }

  // Pattern validation
  if (!CONTACT_PATTERNS.email.test(normalized)) {
    return {
      isValid: false,
      errorMessage: "[adresseMail] format invalide. Exemple: nom@domaine.com",
    };
  }

  return { isValid: true, value: normalized };
};

const validateContact = (body) => {
  const values = {};

  // Validate phone using helper
  const phoneResult = validatePhone(body.numeroTelephonePortable);
  if (!phoneResult.isValid) return phoneResult;
  values.numeroTelephonePortable = phoneResult.value;

  // Validate email using helper
  const emailResult = validateEmail(body.adresseMail);
  if (!emailResult.isValid) return emailResult;
  values.adresseMail = emailResult.value;

  return { isValid: true, values };
};


module.exports = { validateContact };
