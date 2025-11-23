"use strict";

const { nameFormat } = require("../nameFormat");
const {
  communeSearchGeoApiByNameAndPostalCode,
} = require("../communeSearchGeoApi");
const { communeSearchInsee } = require("../communeSearchInsee");
const { getArrondissement } = require("../getArrondissement");
const { validateCountryCode } = require("./validateCountryCode");

const POSTAL_CODE_REGEX = /^[0-9]{5}$/;
const COMPLEMENT_MAX_LENGTH = 37;

const validateField = (value, fieldName, allowNumber = true) => {
  if (!value) {
    return {
      isValid: false,
      errorMessage: `[${fieldName}] n'est pas défini`,
    };
  }

  const validTypes = allowNumber ? ["string", "number"] : ["string"];

  if (!validTypes.includes(typeof value)) {
    const expectedType = allowNumber
      ? "une chaîne de caractères ou un nombre"
      : "une chaîne de caractères";
    return {
      isValid: false,
      errorMessage: `[${fieldName}] doit être ${expectedType}`,
    };
  }

  return { isValid: true };
};

const validateInputs = (body) => {
  // Extract commune value (either field)
  const libelleCommune = body.libelleCommuneResidence || body.libelleCommune;

  // Define all validations in a structured way
  const validations = [
    {
      value: body.libelleVoie,
      fieldName: "libelleVoie (adresse de résidence)",
      allowNumber: false,
      key: "libelleVoie",
    },
    {
      value: body.codePostal,
      fieldName: "codePostal (adresse de résidence)",
      allowNumber: true,
      key: "codePostal",
    },
    {
      value: libelleCommune,
      fieldName: "libelleCommune ou libelleCommuneResidence",
      allowNumber: false,
      key: "libelleCommune",
    },
  ];

  const validatedValues = {};

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

  // Special handling for country code validation
  const countryResult = validateCountryCode(
    body.codePays,
    "codePays (adresse de résidence)"
  ); // !! La recherche du code pays ici n'a pas trop  de sens, les adresses doivent être nécessairement en Frnace (laissé pour backward compatibility avec l'API initiale mais donner un code autre que la france va engendrer une erreur API Urssaf lors de l'inscription)
  if (!countryResult.isValid) return countryResult;
  validatedValues.codePays = countryResult.value;

  return {
    isValid: true,
    values: validatedValues,
  };
};

const getCommune = async (commune, codePostal) => {
  let residenceCommuneInfos;

  const arrondResults = getArrondissement(codePostal);

  if (Array.isArray(arrondResults) && arrondResults.length > 0) {
    residenceCommuneInfos = arrondResults[0];
    return residenceCommuneInfos;
  }

  const communeSearchPromises = [
    communeSearchGeoApiByNameAndPostalCode(commune, codePostal).catch(() => []),
    communeSearchInsee(commune, codePostal).catch(() => []),
  ];

  const [geoResults, inseeResults] = await Promise.allSettled(
    communeSearchPromises
  );

  if (geoResults.status === "fulfilled" && geoResults.value.length === 1) {
    residenceCommuneInfos = geoResults.value[0];
  } else if (
    inseeResults.status === "fulfilled" &&
    inseeResults.value.length === 1
  ) {
    residenceCommuneInfos = inseeResults.value[0];
  }

  return residenceCommuneInfos;
};

const validateResidenceAddress = async (body) => {
  const values = {};

  // 1. Validate all input fields first
  const inputValidation = validateInputs(body);
  if (!inputValidation.isValid) return inputValidation;

  const { libelleVoie, codePays, codePostal, libelleCommune } =
    inputValidation.values;

  // 2. Process and format the validated data
  const formattedVoie = nameFormat(String(libelleVoie), false, true);
  values.libelleVoie = formattedVoie;
  values.complement = formattedVoie.slice(0, COMPLEMENT_MAX_LENGTH);
  values.codePays = codePays;

  // 3. Additional postal code format validation
  const cleanPostalCode = String(codePostal).trim();
  if (!POSTAL_CODE_REGEX.test(cleanPostalCode)) {
    return {
      isValid: false,
      errorMessage:
        "[codePostal (adresse de résidence)] doit être composé de 5 chiffres",
    };
  }
  values.codePostal = cleanPostalCode;

  // 4. Process commune name

  values.libelleCommune = nameFormat(libelleCommune, false, true);

  // 5. Commune search

  const residenceCommuneInfos = await getCommune(
    values.libelleCommune,
    values.codePostal
  );

  if (!residenceCommuneInfos?.COG) {
    return {
      isValid: false,
      errorMessage:
        "[libelleCommune ou libelleCommuneResidence] Veuillez vérifier la ville de résidence, le code postal, et/ou indiquer l'arrondissement (par exemple Lyon 09)",
    };
  }

  values.COG = residenceCommuneInfos.COG;
  values.libelleCommune = residenceCommuneInfos.nom;

  return { isValid: true, values };
};

module.exports = { validateResidenceAddress };
