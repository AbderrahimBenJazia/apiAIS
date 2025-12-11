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

const { validateInvoiceTotals } = require("./validators/validateInvoiceTotals");

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
  "mntFactureHT",
  "mntFactureHt",
  "mntFactureht",
  "totalHT",
  "totalHt",
  "totalht",
  "mntFactureTTC",
  "mntFactureTtc",
  "mntFacturettc",
  "totalTTC",
  "totalTtc",
  "totalttc",
]; // not sure alternative field names (like adressMail...) are necessary here but are kept for backward compatibility with the original API in Realm

const checkInvoiceBody = async (body, professional) => {
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

  // 3. Execute validation pipeline
  const validatedData = Object.create(null);
  let calculatedTotals;

  const validations = [
    validateInvoiceNumber,
    validateInvoiceDates,
    validateAcompte,
    validatePrestationList,
  ];

  for (const validate of validations) {
    const result = validate(cleanBody);
    if (!result.isValid) return result;
    Object.assign(validatedData, result.values);
    if (result.totals) calculatedTotals = result.totals;
  }

  // 4. Validate invoice totals
  const totalsCheck = validateInvoiceTotals(cleanBody, calculatedTotals);
  if (!totalsCheck.isValid) return totalsCheck;
  Object.assign(validatedData, totalsCheck.values);

  return { isValid: true, data: { validatedData, client: customer } };
};

/* const main = async () => {
  const professional = "benjazia.abderrahim@gmail.com";

  const prestation1 = {
    codeNature: "100",
    quantite: "2",
    unite: "heure",
    tauxTVA: "20%",
    mntUnitaireHT: "50",
    commentaire: "Prestation de test",
  };

  const prestation2 = {
    codeNature: "Ménage-repassage",
    quantite: "1",
    unite: "heure",
    tauxTVA: "20%",
    mntUnitaireHT: "50",
    commentaire: "Prestation de test",
  };

  const body = {
    adresseMail: "dupont.martin@gmail.com",
    numFactureTiers: 1,
    dateFacture: "2025-12-03",
    acompte: "10.00131",
    prestationListe: [prestation1, prestation2],
    mntFactureHT: 150,
    mntFactureTTC: 180,
  };

  const response = await bodyCheck(body, professional);

  console.log(response);
  console.log(response.data.prestations);
};

main(); */

module.exports = { checkInvoiceBody};
