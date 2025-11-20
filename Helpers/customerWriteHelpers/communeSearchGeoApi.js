"use strict";

const axios = require("axios");

const POSTAL_CODE_REGEX = /^[0-9]{5}$/;
const GEO_API_BASE_URL = "https://geo.api.gouv.fr/communes";

const normalizeCommunes = (communeList) => {
  return communeList.map((commune) => ({
    nom: commune.nom || "", // Municipality name
    COG: commune.code || "", // INSEE code (Code Officiel Géographique)
    source: "geo", // Source identifier for debugging/tracking
  }));
};

const communeSearchGeoApi = async (postalCode) => {
  try {
    if (!postalCode) return null;

    // Normalize postal code to string and validate format
    const cleanPostalCode = postalCode.toString().trim();

    if (!POSTAL_CODE_REGEX.test(cleanPostalCode)) {
      return []; // Invalid postal code format
    }

    // Build API URL
    const apiUrl = `${GEO_API_BASE_URL}?codePostal=${cleanPostalCode}`;

    // Make API request with timeout and error handling
    const response = await axios.get(apiUrl, {
      timeout: 5000,
      headers: {
        "User-Agent": "AIS-API/1.0.0", // Identify your application
      },
    });

    const communeList = response.data;

    if (!Array.isArray(communeList) || communeList.length === 0) {
      return []; // No communes found
    }

    // Transform and normalize commune data
    const normalizedCommunes = normalizeCommunes(communeList);

    return normalizedCommunes;
  } catch (error) {
    // Log error for debugging but return null for consistent error handling
    console.error(
      `[communeSearchGeoApi] Error fetching communes for postal code ${postalCode}:`,
      error.message
    );
    return [];
  }
};

module.exports = { communeSearchGeoApi };


const main=async()=>{

    const testPostalCode = "54490"; // Example postal code for Paris 1st arrondissement
    const communes = await communeSearchGeoApi(testPostalCode);
    console.log( communes);
}
main();