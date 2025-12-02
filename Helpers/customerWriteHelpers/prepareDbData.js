"use strict";

const { dateFormatMongo } = require("../formatters/dateFormatMongo");
const { titleCase } = require("../formatters/titleCase");

const prepareDbData = (urssafData, userData) => {
  const {
    civilite,
    prenoms,
    nomUsage,
    nomNaissance,
    adresseMail,
    numeroTelephonePortable,
    dateNaissance,
    lieuNaissance,
    adressePostale,
    urssafKeyCustomer,
    statusUrssaf,
    cleExterneClient,
  } = urssafData;

  const now = new Date();
  const { providerId, professional, abonnement } = userData;

  const licence = abonnement?.licence;

  const data = {
    civilite,
    prenoms: titleCase(prenoms),
    nomUsage: titleCase(nomUsage),
    nomNaissance: titleCase(nomNaissance),
    adresseMail: adresseMail.toLowerCase(),
    numeroTelephonePortable: numeroTelephonePortable.replace("+33", "0"),
    dateNaissance: dateFormatMongo(dateNaissance),
    lieuNaissancePaysCode: lieuNaissance?.codePaysNaissance.toString(),
    lieuNaissanceDepartementCode:
      lieuNaissance?.departementNaissance?.toString(),
    lieuNaissanceCommuneCode:
      lieuNaissance?.communeNaissance?.codeCommune?.toString(),
    lieuNaissanceCommuneLibelle:
      lieuNaissance?.communeNaissance?.libelleCommune,
    adressePostaleVoieNumero: undefined,
    adressePostaleVoieLettre: undefined,
    adressePostaleVoieCode: undefined,
    adressePostaleVoieLibelle: adressePostale?.complement,
    adressePostaleComplement: undefined,
    adressePostaleLieuDit: undefined,
    adressePostaleCommuneLibelle: adressePostale?.libelleCommune,
    adressePostaleCommuneCode: adressePostale?.codeCommune?.toString(),
    adressePostaleCodePostal: adressePostale?.codePostal,
    adressePostalePaysCode: "99100",
    urssafKeyCustomer: urssafKeyCustomer,
    statusUrssaf,
    cleExterneClient,
    providerId: providerId,
    userMail: professional,
    professional,
    subscriptionDate: dateFormatMongo(now),
    date: now,
    clientType: licence === "test" ? "test" : "prod",
    production: licence === "test" ? false : true,
    modeInscription: "api",
    mode: "api",
  };

  return data;
};

module.exports = { prepareDbData };
