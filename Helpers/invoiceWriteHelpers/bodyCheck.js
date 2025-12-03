"use strict";

const { validateInvoiceHeader } = require("./validators/validateInvoiceHeader");
const { validateInvoiceDates } = require("./validators/validateInvoiceDates");
const { validatePrestationList } = require("./validators/validatePrestationList");
const { validatePrestation } = require("./validators/validatePrestation");
const { validateInvoiceTotals } = require("./validators/validateInvoiceTotals");

const validateInput = (body) => {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return {
      isValid: false,
      errorMessage: "[bodyCheck] Le corps doit être un objet valide.",
    };
  }
  return { isValid: true };
};

/**
 * Validates and normalizes invoice body data
 * @param {Object} professional - Professional object
 * @param {Object} body - Request body with invoice data
 * @returns {Object} { isValid: boolean, data: Object|null, errorMessage: string|null }
 */
const bodyCheck = async (body) => {
  try {
    // 1. Validate input structure
    const inputCheck = validateInput(body);
    if (!inputCheck.isValid) return inputCheck;

    const validatedData = Object.create(null);

    // 2. Validate invoice header (numFactureTiers, dateFacture, mntAcompte)
    const headerResult = validateInvoiceHeader(body);
    if (!headerResult.isValid) return headerResult;
    Object.assign(validatedData, headerResult.values);

    // 3. Validate invoice dates (dateDebutEmploi, dateFinEmploi, dateVersementAcompte)
    // Pass validated data so dates can reference dateFacture
    const datesResult = validateInvoiceDates({
      ...body,
      dateFacture: validatedData.dateFacture,
    });
    if (!datesResult.isValid) return datesResult;
    Object.assign(validatedData, datesResult.values);

    // 4. Validate prestationList exists and is array
    const prestationListResult = validatePrestationList(body);
    if (!prestationListResult.isValid) return prestationListResult;
    
    validatedData.prestationList = [];

    // 5. Validate each prestation
    const prestations = prestationListResult.values.prestationList;
    for (let i = 0; i < prestations.length; i++) {
      const prestationResult = validatePrestation(prestations[i], i);
      if (!prestationResult.isValid) return prestationResult;
      
      validatedData.prestationList.push(prestationResult.values);
    }

    // 6. Validate invoice totals (cross-check with prestations)
    const totalsResult = validateInvoiceTotals(body, validatedData.prestationList);
    if (!totalsResult.isValid) return totalsResult;
    Object.assign(validatedData, totalsResult.values);

    return { isValid: true, data: validatedData };
  } catch (error) {
    return {
      isValid: false,
      errorMessage: `[bodyCheck] erreur interne lors de la validation: ${error.message}`,
    };
  }
};

module.exports = { bodyCheck };
