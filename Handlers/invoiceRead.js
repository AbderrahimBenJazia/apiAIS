"use strict";

const createApiResponse = require("../Helpers/Responses/apiResponse");
const record = require("../Helpers/Database/record");
const { MESSAGES } = require("../Helpers/Responses/messages");
const { getData } = require("../Helpers/dataReader/getData");

const invoiceProjection = {
  _id: 0,
  adresseMail: 1,
  prenoms: 1,
  nomUsage: 1,
  client: 1,
  numFactureTiers: 1,
  dateFacture: 1,
  dateDebutEmploi: 1,
  dateFinEmploi: 1,
  mntFactureTTC: 1,
  mntFactureHT: 1,
  mntAcompte: 1,
  mntVirement: 1,
  dateVirement: 1,
  statut: 1,
  etat: 1,
  codeRejet: 1,
  commentaireRejet: 1,
  prestations: 1,
  subscriptionDate: 1,
  date: 1,
  prod: 1,
  cleExterneClient: 1,
};

async function invoiceRead(event) {
  try {
    const readCollection = "bill";
    const logCollection = "invoiceRead";
    const projection = invoiceProjection;

    return getData(event, { readCollection, logCollection, projection });
  } catch (error) {
    record({ error }, "bugs");
    return createApiResponse(false, undefined, MESSAGES.INTERNAL_ERROR);
  }
}

module.exports = { invoiceRead };
