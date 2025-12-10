"use strict";

const {
  validateActivityCode,
} = require("./prestationsSubValidators/validateActivityCode");
const {
  validateIntervenant,
} = require("./prestationsSubValidators/validateIntervenant");
const {
  validateQuantity,
} = require("./prestationsSubValidators/validateQuantity");
const {
  validateUnitPrice,
} = require("./prestationsSubValidators/validateUnitPrice");
const {
  validateUnitType,
} = require("./prestationsSubValidators/validateUnitType");
const {
  validateVATRate,
} = require("./prestationsSubValidators/validateVATRate");
const {
  validateCommentaire,
} = require("./prestationsSubValidators/validateCommentaire");
const {
  checkAmountsPrestation,
} = require("./prestationsSubValidators/checkAmountsPrestation");

const validateSinglePrestation = (prestation, prestationNumber) => {
  let validatedData = Object.create(null);

  // Execute validations in sequence
  const validations = [
    { fn: validateActivityCode },
    { fn: validateQuantity },
    { fn: validateUnitType },
    { fn: validateVATRate },
    { fn: validateCommentaire },
    { fn: validateIntervenant },
  ];

  for (const validation of validations) {
    const result = validation.fn(prestation, prestationNumber);
    if (!result.isValid) return result;
    Object.assign(validatedData, result.values);
  }

  // Validate unit price (needs tauxTVA from previous step)
  const priceResult = validateUnitPrice(
    prestation,
    prestationNumber,
    validatedData.tauxTVA
  );
  if (!priceResult.isValid) return priceResult;
  Object.assign(validatedData, priceResult.values);

  // Check amount consistency and calculate totals
  const amountsCheck = checkAmountsPrestation(validatedData, prestationNumber);
  if (!amountsCheck.isValid) return amountsCheck;

  return { isValid: true, values: amountsCheck.value };
};

const main = () => {
  const prestation = {
    codeNature: "garde d'enfant +6 ans",
    quantite: "3",
    unite: "Forfait",
    mntUnitaireHT: 100,
    mntUnitaireTTC: 121.01,
    tauxTVA: 0.21,
    commentaire: "",

  };

  const result = validateSinglePrestation(prestation, 1);

  console.log(result);
};

main();

module.exports = { validateSinglePrestation };
