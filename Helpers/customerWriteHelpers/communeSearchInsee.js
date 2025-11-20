"use strict";

const { connectToDatabase } = require("../Database/mongoConnexion");

const processCommuneName = (communeName, keepIslands) => {
  let cleanCommune = communeName.trim();

  // Handle arrondissements (e.g., "Paris 1" → "Paris 01")
  if (/[0-9]/.test(cleanCommune)) {
    const digitPosition = cleanCommune.search(/[0-9]/);

    // Add leading zero if single digit (Paris 1 → Paris 01)
    if (!/[0-9]{2}/.test(cleanCommune)) {
      cleanCommune =
        cleanCommune.slice(0, digitPosition) +
        "0" +
        cleanCommune.slice(digitPosition);
    }

    // Add space before numbers (Paris01 → Paris 01)
    cleanCommune =
      cleanCommune.slice(0, digitPosition) +
      " " +
      cleanCommune.slice(digitPosition);
  }

  // Normalize commune name
  cleanCommune = cleanCommune.toUpperCase();

  // Remove accents
  cleanCommune = cleanCommune.normalize("NFD").replace(/\p{Diacritic}/gu, "");

  // Keep only alphanumeric characters and spaces
  cleanCommune = cleanCommune.replace(/[^A-Z0-9]/g, " ");

  // Clean up spaces (remove leading/trailing/multiple spaces)
  cleanCommune = cleanCommune.replace(/^\s+|\s+$|\s{2,}/g, " ").trim();

  // Handle Saint abbreviations
  cleanCommune = cleanCommune.replace(/^ST /g, "SAINT ");
  cleanCommune = cleanCommune.replace(/ ST /g, " SAINT ");
  cleanCommune = cleanCommune.replace(/^STE /g, "SAINTE ");
  cleanCommune = cleanCommune.replace(/ STE /g, " SAINTE ");

  // Optional: Handle islands prefix (if needed in future)
  if (!keepIslands) {
    cleanCommune = cleanCommune.replace(/^ILES?\s+/g, "");
  }

  return cleanCommune;
};

const communeSearchInsee = async (communeName, keepIslands = true) => {
  try {
    // Input validation
    if (!communeName || typeof communeName !== "string") {
      return [];
    }

    let cleanCommune = processCommuneName(communeName, keepIslands);

    // Connect to MongoDB and search communes
    const client = await connectToDatabase();
    const db = client.db("api");

    const communeResults = await db
      .collection("customerWriteCodeCommune")
      .find({ nomSearch: cleanCommune })
      .toArray();

    if (!Array.isArray(communeResults) || communeResults.length === 0) {
      return [];
    }

    // Add source identifier for debugging
    const searchResults = communeResults.map((commune) => ({
      ...commune,
      source: "insee",
    }));

    return searchResults;
  } catch (error) {
    console.error(
      `[communeSearchInsee] Error searching commune "${communeName}"`,
      error.message
    );
    return [];
  }
};

module.exports = { communeSearchInsee };

const main = async () => {
  const results = await communeSearchInsee("AMAREINS");
  console.log(results);
};

main();
