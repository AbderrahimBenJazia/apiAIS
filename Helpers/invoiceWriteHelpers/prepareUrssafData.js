"use strict";

const { dateFormatUrssaf } = require("../formatters/dateFormatUrssaf");

const prepareUrssafData = (professionalData, customer, validatedData) => {
  // Prepare prestations list for URSSAF
  const urssafPrestationListe = validatedData.prestations.map((prestation) => {
    return {
      codeNature: prestation.codeNature,
      quantite: prestation.quantite,
      unite: prestation.unite,
      mntUnitaireTTC: prestation.mntUnitaireTTC,
      mntPrestationTTC: prestation.mntPrestationTTC,
      mntPrestationHT: prestation.mntPrestationHT,
      mntPrestationTVA:
        prestation.mntPrestationTTC - prestation.mntPrestationHT,
      complement1: prestation.commentaire || "",
      complement2: prestation.intervenant || professionalData.information.nova,
    };
  });

  // Prepare main invoice data for URSSAF
  const urssafData = {
    idTiersFacturation: professionalData.information.nomSociete || "sap.fr",
    idClient: customer.urssafKeyCustomer,
    dateNaissanceClient: dateFormatUrssaf(customer.dateNaissance),
    numFactureTiers: validatedData.numFactureTiers,
    dateFacture: validatedData.dateFacture,
    dateDebutEmploi: validatedData.dateDebutEmploi,
    dateFinEmploi: validatedData.dateFinEmploi,
    mntAcompte: validatedData.mntAcompte || 0,
    dateVersementAcompte: validatedData.dateVersementAcompte,
    mntFactureTTC: validatedData.mntFactureTTC,
    mntFactureHT: validatedData.mntFactureHT,
    inputPrestations: urssafPrestationListe,
  };

  return urssafData;
};

module.exports = { prepareUrssafData };
