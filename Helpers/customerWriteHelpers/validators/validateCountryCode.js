"use strict";

const {

  checkIfCountryCodeExists,
} = require("../communes/getCountryCode");

const validateCountryCode = (codePays, fieldName,defaultValue = 99100) => {
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
  }

  // Handle country name lookup
  const isCountryCodeValid = checkIfCountryCodeExists(parseInt(codePays));

  if (!isCountryCodeValid) {
    return {
      isValid: false,
      errorMessage: `[${fieldName}] n'a pas pu être trouvé. Veuillez vérifier le code founrni`,
    };
  }

  return { isValid: true, value: parseInt(codePays) };
};

module.exports = { validateCountryCode };
