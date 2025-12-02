"use strict";

const { nameFormat } = require("../../formatters/nameFormat");
const { dateFormatUrssaf } = require("../../formatters/dateFormatUrssaf");
const { communeSearchInsee } = require("../communes/communeSearchInsee");
const { getArrondissement } = require("../communes/getArrondissement");
const { validateCountryCode } = require("./validateCountryCode");
const { validateField } = require("./validateFieldUtils");
const {
  communeSearchGeoApiByName,
} = require("../communes/communeSearchGeoApi");

const validateBirthInputs = (body) => {
  const validatedValues = {};

  const countryResult = validateCountryCode(
    body.codePaysNaissance,
    "codePaysNaissance"
  );

  if (!countryResult.isValid) return countryResult;
  validatedValues.codePaysNaissance = countryResult.value;

  // Define all validations in a structured way
  const validations = [
    {
      value: body.dateNaissance,
      fieldName: "dateNaissance",
      allowNumber: false,
      key: "dateNaissance",
    },
  ];

  if (countryResult.value === 99100) {
    validations.push({
      value: body.libelleCommuneNaissance,
      fieldName: "libelleCommuneNaissance",
      allowNumber: false,
      key: "libelleCommuneNaissance",
    });
  }

  // Loop through basic field validations
  for (const validation of validations) {
    const result = validateField(
      validation.value,
      validation.fieldName,
      validation.allowNumber
    );
    if (!result.isValid) return result;
    validatedValues[validation.key] = validation.value;
  }

  return {
    isValid: true,
    values: validatedValues,
  };
};

const getBirthCommune = async (commune) => {
  let communeNaissanceList = [];

  // Check arrondissements first (highest priority)
  const arrondResults = getArrondissement(commune);
  if (Array.isArray(arrondResults) && arrondResults.length > 0) {
    communeNaissanceList = arrondResults;
    return communeNaissanceList;
  }

  // Search both APIs in parallel to get separate results
  const communeSearchPromises = [
    communeSearchGeoApiByName(commune).catch(() => []),
    communeSearchInsee(commune).catch(() => []),
  ];

  const [geoApiResults, inseeResults] = await Promise.all(
    communeSearchPromises
  );

  // Priority: Use INSEE first, fallback to Geo API if INSEE yields nothing
  if (Array.isArray(inseeResults) && inseeResults.length > 0) {
    communeNaissanceList = inseeResults;
  } else if (Array.isArray(geoApiResults) && geoApiResults.length > 0) {
    // Filter Geo API results to ensure exact name match
    const exactMatches = geoApiResults.filter((result) => {
      if (!result || !result.nom) return false;
      // Normalize both names for comparison (case-insensitive, trim spaces)
      const resultName = result.nom.toLowerCase().trim();
      const searchName = commune.toLowerCase().trim();
      return resultName === searchName;
    });

    // Only use Geo API results if we have exact matches
    if (exactMatches.length > 0) {
      communeNaissanceList = exactMatches;
    }
  }

  // Filter for unique COG codes in the final array
  if (communeNaissanceList.length > 1) {
    const seenCodes = new Set();
    communeNaissanceList = communeNaissanceList.filter((commune) => {
      if (!commune?.COG || seenCodes.has(commune.COG)) return false;
      seenCodes.add(commune.COG);
      return true;
    });
  }

  return communeNaissanceList;
};

const validateBirthInformation = async (body) => {
  const values = {};

  // 1. Validate all input fields first
  const inputValidation = validateBirthInputs(body);
  if (!inputValidation.isValid) return inputValidation;

  const { dateNaissance, codePaysNaissance, libelleCommuneNaissance } =
    inputValidation.values;

  // 2. Process and format birth date
  const formattedDate = dateFormatUrssaf(dateNaissance);
  if (!formattedDate) {
    return {
      isValid: false,
      errorMessage:
        "[dateNaissance] doit être au format yyyy-MM-dd ou dd-MM-yyyy",
    };
  }
  values.dateNaissance = formattedDate;

  // 3. Set country code
  values.codePaysNaissance = codePaysNaissance;
  values.libelleCommuneNaissanceList = [];
  // 4. Handle commune for French births
  if (codePaysNaissance === 99100) {
    // French birth - search commune
    const normalizedCommune = nameFormat(
      libelleCommuneNaissance.toString(),
      false,
      true
    );

    const communeNaissanceList = await getBirthCommune(normalizedCommune);

    if (communeNaissanceList.length === 0) {
      return {
        isValid: false,
        errorMessage: `[libelleCommuneNaissance] Veuillez vérifier la ville de naissance et/ou indiquer l'arrondissement (par exemple Lyon 09) (ici ${libelleCommuneNaissance})`,
      };
    }

    values.libelleCommuneNaissanceList = communeNaissanceList;
  }

  return { isValid: true, values };
};

module.exports = { validateBirthInformation };
