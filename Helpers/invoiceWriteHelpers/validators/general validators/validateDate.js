"use strict";

const { dateFormatUrssaf } = require("../../../formatters/dateFormatUrssaf");

const validateDate = (dateValue, fieldName, options = {}) => {
  const {
    defaultValue = undefined,
    min = null,
    max = null,
    allowFuture = false,
    minErrorMessage = null,
    maxErrorMessage = null,
  } = options;

  if (dateValue === undefined || dateValue === null) {
    if (defaultValue !== undefined) {
      return validateDate(defaultValue, fieldName, {
        ...options,
        defaultValue: undefined, // Prevent infinite recursion
      });
    }
    return {
      isValid: false,
      value: null,
      errorMessage: `[${fieldName}] n'est pas défini(e)`,
    };
  }

  // Format the date
  const formatted = dateFormatUrssaf(dateValue);

  if (!formatted) {
    return {
      isValid: false,
      value: null,
      errorMessage: `[${fieldName}] est invalide.)`,
    };
  }

  // Parse the formatted date to check constraints
  const dateObj = new Date(formatted);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // Check if date is today - use current hour instead of 02:00:00Z
  const inputDate = new Date(
    dateObj.getFullYear(),
    dateObj.getMonth(),
    dateObj.getDate()
  );

  let finalFormatted = formatted;

  if (inputDate.getTime() === today.getTime()) {
    // Date is today - use current time
    finalFormatted = now.toISOString();
  }

  // Check future date
  if (!allowFuture && dateObj > now) {
    return {
      isValid: false,
      value: null,
      errorMessage: `[${fieldName}] ne peut pas être dans le futur.`,
    };
  }

  // Check minimum date
  if (min !== null) {
    const minFormatted = dateFormatUrssaf(min);
    if (!minFormatted) {
      return {
        isValid: false,
        value: null,
        errorMessage: `[${fieldName}] contrainte min invalide.`,
      };
    }
    const minDate = new Date(minFormatted);
    if (dateObj < minDate) {
      return {
        isValid: false,
        value: null,
        errorMessage: minErrorMessage || `[${fieldName}] doit être postérieure ou égale à ${minDate.toISOString().split("T")[0]}.`,
      };
    }
  }

  // Check maximum date
  if (max !== null) {
    const maxFormatted = dateFormatUrssaf(max);
    if (!maxFormatted) {
      return {
        isValid: false,
        value: null,
        errorMessage: `[${fieldName}] contrainte max invalide.`,
      };
    }
    const maxDate = new Date(maxFormatted);
    if (dateObj > maxDate) {
      return {
        isValid: false,
        value: null,
        errorMessage: maxErrorMessage || `[${fieldName}] doit être antérieure ou égale à ${maxDate.toISOString().split("T")[0]}.`,
      };
    }
  }

  return {
    isValid: true,
    value: finalFormatted,
    errorMessage: null,
  };
};

module.exports = { validateDate };
