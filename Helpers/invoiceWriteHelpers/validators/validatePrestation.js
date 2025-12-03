"use strict";

const { validateActivityCode } = require("./validateActivityCode");
const { validateUnitType } = require("./validateUnitType");
const { validateQuantity } = require("./validateQuantity");
const { validateVATRate } = require("./validateVATRate");
const { validateUnitPrice } = require("./validateUnitPrice");
const { findDictValue } = require("../../General/findDictValue");
const { validateWorkerIdentifier } = require("./validateWorkerIdentifier");

/**
 * Validates a single prestation object
 * @param {Object} prestation - Single prestation from prestationList
 * @param {number} index - Index for error messages
 */
const validatePrestation = (prestation, index) => {
  const prestationNumber = index + 1;
  const values = {};

  // 1. Activity code
  const codeResult = validateActivityCode(prestation, prestationNumber);
  if (!codeResult.isValid) return codeResult;
  Object.assign(values, codeResult.values);

  // 2. Unit type (HEURE or FORFAIT)
  const uniteResult = validateUnitType(prestation, prestationNumber);
  if (!uniteResult.isValid) return uniteResult;
  Object.assign(values, uniteResult.values);

  // 3. Quantity
  const qteResult = validateQuantity(prestation, prestationNumber);
  if (!qteResult.isValid) return qteResult;
  Object.assign(values, qteResult.values);

  // 4. VAT rate
  const tvaResult = validateVATRate(prestation, prestationNumber);
  if (!tvaResult.isValid) return tvaResult;
  Object.assign(values, tvaResult.values);

  // 5. Unit price (HT or TTC)
  const priceResult = validateUnitPrice(
    prestation,
    prestationNumber,
    values.tauxTVA
  );
  if (!priceResult.isValid) return priceResult;
  Object.assign(values, priceResult.values);

  // 6. complement1 (optional comment)
  const [complement1] = findDictValue(
    ["complement1", "commentaire"],
    prestation,
    false
  );
  if (complement1) {
    values.complement1 = complement1.toString();
  }

  // 7. complement2 (optional worker identifier)
  const workerResult = validateWorkerIdentifier(prestation, prestationNumber);
  if (!workerResult.isValid) return workerResult;
  Object.assign(values, workerResult.values);

  return { isValid: true, values };
};

module.exports = { validatePrestation };
