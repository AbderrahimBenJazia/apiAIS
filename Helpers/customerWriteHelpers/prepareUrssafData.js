"use strict";

const getCodeCommuneFromCog = (cog, departement) => {
  if (!cog || !departement) return null;
  
  // For 2-digit departments (most of France): COG format is DDCCC (5 chars)
  // For 3-digit departments (DOM-TOM): COG format is DDDCC (5 chars)
  if (departement.length === 2) {
    return cog.slice(-3); // Last 3 digits for standard departments
  } else {
    return cog.slice(-2); // Last 2 digits for DOM-TOM
  }
};

const prepareUrssafData = (data) => {


  const nIterations = data.libelleCommuneNaissanceList?.length || 0;

  const {
    civilite,
    nomNaissance,
    nomUsage,
    prenoms,
    dateNaissance,
    codePaysNaissance,
    numeroTelephonePortable,
    adresseMail,
    codePostal,
    complement,
    codeCommuneResidence,
    libelleCommune,
    codePays,
    bic,
    iban,
    titulaire,
    libelleCommuneNaissanceList,
  } = data;

 

  // Extract commune code from COG if needed
  const departement = codeCommuneResidence?.slice(0, 2);
  const communeCode = codeCommuneResidence?.length === 5
    ? getCodeCommuneFromCog(codeCommuneResidence, departement)
    : codeCommuneResidence;

  const infos = {
    civilite,
    nomNaissance,
    nomUsage,
    prenoms,
    adresseMail,
    numeroTelephonePortable,
    dateNaissance,
    adressePostale: {
      codePostal,
      complement,
      codePays,
      libelleCommune,
      codeCommune: communeCode,
    },
    coordonneeBancaire: {
      bic,
      iban,
      titulaire,
    },
  };

  let urssafData = [];
  
  // Non-French birth country
  if (codePaysNaissance !== 99100) {
    infos.lieuNaissance = {
      codePaysNaissance,
    };
    urssafData = [infos];
  } else {
    // French birth - iterate through possible communes
    for (let i = 0; i < nIterations; i++) {
      const communeInfo = libelleCommuneNaissanceList[i];
      
      const { departement, nom, COG, codeCommune } = communeInfo;

      urssafData.push({
        ...infos,
        lieuNaissance: {
          codePaysNaissance,
          communeNaissance: {
            codeCommune: codeCommune || getCodeCommuneFromCog(COG, departement),
            libelleCommune: nom,
          },
          departementNaissance:
            departement?.length === 2 ? "0" + departement : departement,
        },
      });
    }
  }

  return urssafData;
};

module.exports = { prepareUrssafData };
