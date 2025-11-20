"use strict";

const countryFormat = (name, keepIslands = true) => {
  if (typeof name !== "string")  return "";
  
  // Convert to string (in case numbers are passed) and make uppercase
  let processed = name.toString().toUpperCase();
  
  // Remove accents (Côte → COTE, Müller → MULLER)
  processed = processed.normalize("NFD").replace(/\p{Diacritic}/gu, "");
  
  // Replace apostrophes and hyphens with spaces for easier word processing
  // "COTE D'IVOIRE" → "COTE D IVOIRE"
  processed = processed.replace(/['-]/g, " ");
  
  // Expand Saint abbreviations (ST → SAINT)
  // "ST MARTIN" → "SAINT MARTIN"
  processed = processed.replace(/\bST\b/g, "SAINT");

  // Optionally remove island prefixes
  if (!keepIslands) {
    // Remove "ILE" or "ILES" from the beginning
    // "ILES COMORES" → "COMORES"
    processed = processed.replace(/^ILES?\s+/g, "");
  }
  
  // Remove common French articles and prepositions
  // "LA FRANCE" → "FRANCE", "SUR MER" → "MER"
  processed = processed.replace(/\b(?:L|LA|LE|LES|D|DE|DES|SUR)\b/g, "");
  
  // Keep only letters, removing all spaces and special characters
  // "COTE  IVOIRE" → "COTEDIVOIRE"
  return processed.replace(/[^A-Z]/g, "");
};

module.exports = { countryFormat };
