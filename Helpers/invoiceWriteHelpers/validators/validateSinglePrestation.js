"use strict";

const { findDictValue } = require("../../General/findDictValue");
const {
  validateActivityCode,
} = require("./prestationsSubValidators/validateActivityCode");
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

const ALLOWED_FIELDS = [
  "codeNature",
  "activity",
  "activite",
  "activité",
  "type",
  "nature",
  "unité",
  "unite",
  "unity",
  "nombre",
  "quantite",
  "qte",
  "nombre",
  "nb",
  "mntUnitaireHT",
  "mntUnitaireht",
  "montantHT",
  "prixHT",
  "mntUnitaireTTC",
  "mntUnitairettc",
  "montantTTC",
  "prixTTC",
  "tauxTVA",
  "tva",
  "TVA",
  "commentaire",
  "complement1",
  "complement2",
  "intervenant",
];

const validateSinglePrestation = (prestation, counter) => {
  const validations = [
    { fn: validateActivityCode },
    { fn: validateQuantity },
    { fn: validateUnitPrice },
    { fn: validateUnitType },
    { fn: validateVATRate },
  ];

  const validatedData = Object.create(null);
  for (const validation of validations) {
    const result = validation.fn(cleanBody);

    if (!result.isValid) return result;
    Object.assign(validatedData, result.values);
  }

  console.log(validatedData);

  return { isValid: true, data: validatedData };
};

module.exports = { validateSinglePrestation };
