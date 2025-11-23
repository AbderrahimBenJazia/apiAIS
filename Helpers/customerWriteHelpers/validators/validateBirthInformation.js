"use strict";

const { nameFormat } = require('../nameFormat');
const { dateFormatUrssaf } = require('../dateFormatUrssaf');
const { communeSearchInsee } = require('../communeSearchInsee');
const { getArrondissement } = require('../getArrondissement');
const { validateCountryCode } = require('./validateCountryCode');


const validateBirthInformation = async (body) => {
  const values = {};
  
  // Birth date validation
  if (!body.dateNaissance) {
    return {
      isValid: false,
      errorMessage: "[dateNaissance] n'est pas définie",
    };
  }

  const dateNaissance = dateFormatUrssaf(body.dateNaissance);

  if (!dateNaissance) {
    return {
      isValid: false,
      errorMessage: "[dateNaissance] doit être au format 2000-01-01 ou 01-01-2000)",
    };
  }
  values.dateNaissance = dateNaissance;

  // Birth country validation using shared helper
  const countryResult = validateCountryCode(body.codePaysNaissance, "codePaysNaissance");
  if (!countryResult.isValid) return countryResult;
  values.codePaysNaissance = countryResult.value;

  // Birth commune (only for French births)
  if (values.codePaysNaissance !== 99100) {
    values.libelleCommuneNaissanceList = [{}]; // Placeholder for foreign births
  } else {
    if (!body.libelleCommuneNaissance) {
      return {
        isValid: false,
        errorMessage: "[libelleCommuneNaissance] n'est pas défini",
      };
    }

    const libelleCommuneNaissance = nameFormat(
      body.libelleCommuneNaissance.toString(),
      false,
      true
    );

    let libelleCommuneNaissanceList = [];

    try {
      // Search INSEE database - this async operation could throw
      const inseeResults = await communeSearchInsee(
        libelleCommuneNaissance,
        "naissance"
      );
      if (inseeResults) {
        libelleCommuneNaissanceList.push(...inseeResults);
      }
    } catch (error) {
      // If INSEE search fails, continue with arrondissement search
      console.warn(`INSEE search failed for ${libelleCommuneNaissance}:`, error);
    }

    // Search arrondissements - this is synchronous and safe
    const arrondResults = getArrondissement(libelleCommuneNaissance);
    if (arrondResults.length > 0) {
      libelleCommuneNaissanceList.push(...arrondResults);
    }

    if (libelleCommuneNaissanceList.length === 0) {
      return {
        isValid: false,
        errorMessage: `[libelleCommuneNaissance] Veuillez vérifier la ville de naissance et/ou indiquer l'arrondissement (par exemple Lyon 09) (ici ${body.libelleCommuneNaissance})`,
      };
    }

    values.libelleCommuneNaissanceList = libelleCommuneNaissanceList;
  }

  return { isValid: true, values };
};

module.exports = { validateBirthInformation };