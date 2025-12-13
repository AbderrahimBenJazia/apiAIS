"use strict";

const {
  formatClientAddress,
} = require("../invoiceWriteHelpers/formatClientAddress");
const { dateFormatMongo } = require("../formatters/dateFormatMongo");

const prepareDbData = (
  professionalData,
  customer,
  validatedData,
  urssafResponse
) => {
  const civiliteFull = customer.civilite === "1" ? "Monsieur " : "Madame ";

  // Extract status information from URSSAF response
  const { statut, infoVirement } = urssafResponse.status || {};
  const { code, libelle } = statut || {};

  const mongo = {
    // Invoice data
    numFactureTiers: validatedData.numFactureTiers,
    idFacture: urssafResponse.idFacture, // Given by URSSAF after declaration
    idTiersFacturation: professionalData.information.nomSociete || "test",
    dateFacture: dateFormatMongo(validatedData.dateFacture),
    dateDebutEmploi: dateFormatMongo(validatedData.dateDebutEmploi),
    dateFinEmploi: dateFormatMongo(validatedData.dateFinEmploi),
    dateVersementAcompte: validatedData.dateVersementAcompte
      ? dateFormatMongo(validatedData.dateVersementAcompte)
      : null,
    mntAcompte: validatedData.mntAcompte || 0,
    mntFactureTTC: validatedData.mntFactureTTC,
    mntFactureHT: validatedData.mntFactureHT,
    prestations: validatedData.prestations,

    // Customer data
    idClient: customer.urssafKeyCustomer,
    idClientAIS: customer._id.toString(),
    cleExterneClient:
      customer.cleExterneClient || customer.idAutoDeclaration || "",
    civilite: customer.civilite,
    prenoms: customer.prenoms,
    nomUsage: customer.nomUsage,
    client: customer.prenoms + " " + customer.nomUsage.toUpperCase(),
    clientFullName:
      civiliteFull + customer.prenoms + " " + customer.nomUsage.toUpperCase(),
    adresseMail: customer.adresseMail,
    adresseMailClient: customer.adresseMail,
    adresseClient: formatClientAddress(customer),

    // URSSAF response status
    etat: libelle,
    statut: code,
    mntVirement: infoVirement?.mntVirement,
    dateVirement: infoVirement?.dateVirement
      ? dateFormatMongo(infoVirement.dateVirement)
      : null,
    codeRejet: "",
    commentaireRejet: "",

    // AIS metadata
    providerId: professionalData.providerId,
    professional: professionalData.professional,
    subscriptionDate: dateFormatMongo(new Date().toISOString().slice(0, 10)),
    date: new Date(),
    modeDeclaration: "api",
    mode: "api",
    factureTest:
      professionalData.abonnement.licence === "test" ? "test" : "prod",
    prod: professionalData.abonnement.licence !== "test",
    siret: professionalData.information.siret,
    hasTva: validatedData.mntFactureTTC - validatedData.mntFactureHT > 0.02,
  };

  return mongo;
};

module.exports = { prepareDbData };
