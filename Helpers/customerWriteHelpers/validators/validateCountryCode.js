"use strict";

const { getCountryCode } = require("../getCountryCode");

const validateCountryCode = (codePays, fieldName, defaultValue = 99100) => {
  // Use default value if not provided
  if (!codePays) {
    return { isValid: true, value: defaultValue };
  }

  // Handle numeric country code
  if (!isNaN(codePays * 1)) {
    const numericCode = codePays * 1;
    if (numericCode.toString().length !== 5) {
      return {
        isValid: false,
        errorMessage: `[${fieldName}] doit contenir 5 chiffres (e.g 99100)`,
      };
    }
    return { isValid: true, value: numericCode };
  }

  // Handle country name lookup
  const countryResult = getCountryCode(codePays);
  if (!countryResult.code) {
    return {
      isValid: false,
      errorMessage: `[${fieldName}] n'a pas pu être trouvé. Veuillez vérifier l'orthographe`,
    };
  }

  return { isValid: true, value: countryResult.code };
};

module.exports = { validateCountryCode };
