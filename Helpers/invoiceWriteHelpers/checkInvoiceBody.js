"use strict";

const { validateBody } = require("../General/validateBody");
const { extractBodyValidFields } = require("../General/extractBodyValidFields");
const { checkCustomer } = require("./checkCustomer");
const { validateInvoiceNumber } = require("./validators/validateInvoiceNumber");
const { validateInvoiceDates } = require("./validators/validateInvoiceDates");
const { validateAcompte } = require("./validators/validateAcompte");
const {
  validatePrestationList,
} = require("./validators/validatePrestationList");

const ALLOWED_FIELDS = [
  "adresseMail",
  "adressMail",
  "mailAdress",
  "mail",
  "Mail",
  "cleExterneClient",
  "cleexterneclient",
  "numFactureTiers",
  "facture",
  "numeroFacture",
  "numero",
  "dateFacture",
  "dateDebutEmploi",
  "dateFinEmploi",
  "dateVersementAcompte",
  "mntAcompte",
  "acompte",
  "totalAcompte",
  "mntAccompte",
  "accompte",
  "totalAccompte",
  "prestationListe",
  "prestationList",
  "prestations",
]; // not sure alternative field names (like adressMail...) are necessary here but are kept for backward compatibility with the original API in Realm

const bodyCheck = async (body, professional) => {
  // 1. Validate input structure
  const inputCheck = validateBody(body);
  if (!inputCheck.isValid) return inputCheck;

  const cleanBody = extractBodyValidFields(body, ALLOWED_FIELDS);

  // 2. Check customer existence
  const customerCheckResult = await checkCustomer(professional, cleanBody);

  if (!customerCheckResult.found) {
    return {
      isValid: false,
      errorMessage: `[client] Client non trouvé: ${customerCheckResult.errorMessage}`,
    };
  }

  const customer = customerCheckResult.client;

  // 3. Define validation pipeline
  const validations = [
    { fn: validateInvoiceNumber },
    { fn: validateInvoiceDates },
    { fn: validateAcompte },
    { fn: validatePrestationList },
  ];

  // 4. Execute validation pipeline
  const validatedData = Object.create(null);
  for (const validation of validations) {
    const result = validation.fn(cleanBody);

    if (!result.isValid) return result;
    Object.assign(validatedData, result.values);
  }

  return { isValid: true, data: validatedData };
};

const main = async () => {
  const professional = "benjazia.abderrahim@gmail.com";

  const body = {
    adresseMail: "dupont.martin@gmail.com",
    numFactureTiers: 1,
    dateFacture: "2025-12-03",
    acompte: "10.00131",
    prestationListe: [],
  };

  const response = await bodyCheck(body, professional);

  console.log(response);
};

main();

module.exports = { bodyCheck };
