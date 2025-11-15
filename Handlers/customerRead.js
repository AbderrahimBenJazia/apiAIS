"use strict";

const createApiResponse = require("../Helpers/Responses/apiResponse");
const record = require("../Helpers/Database/record");
const { MESSAGES } = require("../Helpers/Responses/messages");
const { getData } = require("../Helpers/dataReader/getData");
const customerProjection = {
  _id: 0,
  civilite: 1,
  prenoms: 1,
  nomNaissance: 1,
  nomUsage: 1,
  adresseMail: 1,
  numeroTelephonePortable: 1,
  dateNaissance: 1,
  lieuNaissancePaysCode: 1,
  lieuNaissanceDepartementCode: 1,
  lieuNaissanceCommuneCode: 1,
  lieuNaissanceCommuneLibelle: 1,
  adressePostaleVoieNumero: 1,
  adressePostaleVoieLettre: 1,
  adressePostaleVoieCode: 1,
  adressePostaleVoieLibelle: 1,
  adressePostaleComplement: 1,
  adressePostaleLieuDit: 1,
  adressePostaleCodePostal: 1,
  adressePostaleCommuneLibelle: 1,
  modeInscription: 1,
  statusUrssaf: 1,
  subscriptionDate: 1,
  date: 1,
  cleExterneClient: 1,
};

async function customerRead(event) {
  try {
    const readCollection = "customer";
    const logCollection = "customerRead";
    const projection = customerProjection;

    return getData(event, { readCollection, logCollection, projection });
  } catch (error) {
    record({ error }, "bugs");
    return createApiResponse(false, undefined, MESSAGES.INTERNAL_ERROR);
  }
}
module.exports = { customerRead };
