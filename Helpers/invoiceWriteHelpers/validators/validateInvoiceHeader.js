"use strict";

const { validateInvoiceNumber } = require("./validateInvoiceNumber");
const { validateInvoiceDate } = require("./validateInvoiceDate");
const { validateDownPayment } = require("./validateDownPayment");

/**
 * Validates invoice header fields: numFactureTiers, dateFacture, mntAcompte
 */
const validateInvoiceHeader = (body) => {
  // 1. Invoice number
  const numResult = validateInvoiceNumber(body);
  if (!numResult.isValid) return numResult;

  // 2. Invoice date
  const dateResult = validateInvoiceDate(body);
  if (!dateResult.isValid) return dateResult;

  // 3. Down payment (optional)
  const acompteResult = validateDownPayment(body);
  if (!acompteResult.isValid) return acompteResult;

  return {
    isValid: true,
    values: {
      ...numResult.values,
      ...dateResult.values,
      ...acompteResult.values,
    },
  };
};

module.exports = { validateInvoiceHeader };
