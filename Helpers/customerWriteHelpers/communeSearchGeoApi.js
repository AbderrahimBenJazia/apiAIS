"use strict";

const axios = require("axios");

// Constants

const GEO_API_BASE_URL = "https://geo.api.gouv.fr/communes";
const REQUEST_TIMEOUT = 5000;
const USER_AGENT = "AIS-API/1.0.0";

const normalizeCommunes = (communeList) => {
  return communeList.map((commune) => ({
    nom: commune.nom || "",
    COG: commune.code || "", // More descriptive name
    codePostal: commune.codesPostaux || [commune.codePostal],
    departement: commune?.codeDepartement || null,
    source: "geo", // Source identifier for debugging/tracking
  }));
};

const fetchCommunesFromGeoApi = async (queryType, queryValue, options = {}) => {
  try {
    if (!queryValue) return [];

    // Normalize input
    const cleanValue = queryValue.toString().trim();

    // Build query parameters
    const queryParams = new URLSearchParams({
      [queryType]: cleanValue,
      ...options,
    });

    const apiUrl = `${GEO_API_BASE_URL}?${queryParams.toString()}`;

    // Make API request with consistent configuration
    const response = await axios.get(apiUrl, {
      timeout: REQUEST_TIMEOUT,
      headers: {
        "User-Agent": USER_AGENT,
      },
    });

    const communeList = response.data;

    if (!Array.isArray(communeList) || communeList.length === 0) {
      return [];
    }

    return normalizeCommunes(communeList);
  } catch (error) {
    console.error(
      `[communeSearchGeoApi] Error fetching communes for ${queryType} "${queryValue}":`,
      error.message
    );
    return [];
  }
};

const communeSearchGeoApiByPostalCode = async (postalCode) => {
  if (!postalCode) return [];

  const cleanPostalCode = postalCode.toString().trim();

  return fetchCommunesFromGeoApi("codePostal", cleanPostalCode);
};

const communeSearchGeoApiByName = async (commune) => {
  if (!commune) return [];

  const options = {
    boost: "population", // Boost results by population for relevance
    limit: "20", // Limit results to avoid too many matches
  };

  return fetchCommunesFromGeoApi("nom", commune, options);
};

const communeSearchGeoApiByNameAndPostalCode = async (
  communeName,
  postalCode
) => {
  if (!communeName || !postalCode) return [];

  // Clean and validate postal code
  const cleanPostalCode = postalCode.toString().trim();

  try {
    // First, search by commune name to get all potential matches
    const communesByName = await communeSearchGeoApiByName(communeName);

    if (!Array.isArray(communesByName) || communesByName.length === 0) {
      return [];
    }

    // Find the single commune that matches both name and postal code
    const matchedCommune = communesByName.find((commune) => {
      return commune.codePostal.includes(cleanPostalCode);
    });

    return matchedCommune ? [matchedCommune] : [];
  } catch (error) {
    console.error(
      `[communeSearchGeoApi] Error searching for commune "${communeName}" with postal code "${cleanPostalCode}":`,
      error.message
    );
    return [];
  }
};

module.exports = {
  communeSearchGeoApiByPostalCode,
  communeSearchGeoApiByName,
  communeSearchGeoApiByNameAndPostalCode,
};
