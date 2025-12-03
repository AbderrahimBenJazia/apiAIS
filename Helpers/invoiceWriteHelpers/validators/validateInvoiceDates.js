"use strict";

const { validateEmploymentStartDate } = require("./validateEmploymentStartDate");
const { validateEmploymentEndDate } = require("./validateEmploymentEndDate");
const { validateDownPaymentDate } = require("./validateDownPaymentDate");

/**
 * Validates employment dates with fallback logic
 * Requires dateFacture to be already validated
 */
const validateInvoiceDates = (body) => {
  const validatedData = {};

  // 1. Employment start date
  const startResult = validateEmploymentStartDate(body);
  if (!startResult.isValid) return startResult;
  Object.assign(validatedData, startResult.values);

  // 2. Employment end date
  const endResult = validateEmploymentEndDate(body, validatedData);
  if (!endResult.isValid) return endResult;
  Object.assign(validatedData, endResult.values);

  // 3. Down payment date
  const paymentResult = validateDownPaymentDate(body, validatedData);
  if (!paymentResult.isValid) return paymentResult;
  Object.assign(validatedData, paymentResult.values);

  return {
    isValid: true,
    values: validatedData,
  };
};

module.exports = { validateInvoiceDates };
