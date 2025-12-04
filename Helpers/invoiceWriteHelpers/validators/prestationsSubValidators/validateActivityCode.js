"use strict";

const { findDictValue } = require("../../../General/findDictValue");
const { validateStringField } = require("../general validators/validateString");
const { getFieldName } = require("./getFieldName");
// Activity code dictionary
const ACTIVITY_CODES = {
  //enfants et soutien scolaire
  "Garde d'enfant handicapé": 10,
  "Accompagnement déplacement d'enfant handicapé": 20,
  "Garde d'enfant + 6 ans": 90,
  "Accompagnement déplacement d'enfant + 6 ans": 200,
  "Soutien scolaire et cours à domicile": 100,
  "soutien scolaire": 100,

  //personnes dépendantes
  "Aide humaine": 30,
  "Conduite du véhicule personnel": 40,
  "Accompagnement pour les sorties": 50,
  "Coiffure - esthétique": 110,

  //invalidite temporaire
  "Conduite de véhicule personnel - temporaire": 230,
  "Accompagnement pour les sorties - temporaire": 240,
  "Aide humaine - temporaire": 250,

  //menage, jardin, bricolage, surveillance et animaux
  "Ménage- repassage": 60,
  Jardinage: 70,
  "Petit bricolage": 80,
  "Soins et promenades danimaux": 170,
  Gardiennage: 180,

  //repas et livraison
  "Préparation de repas": 120,
  "Livraison de repas": 130,
  "Collecte et livraison de linge": 140,
  "Livraison de course": 150,

  //assisstance
  "Assistance informatique": 160,
  "Assistance administrative": 190,
  Téléassistance: 210,
  "Interprétariat et codage": 220,
  "Plateforme de coordination": 260,

  //non éligible
  "Divers - Non eligible": 270,
};

// Pre-computed lookup maps
const CODE_TO_NAME = {}; // { 10: "Garde d'enfant handicapé", ... }
const NORMALIZED_TO_ACTIVITY = {}; // { "gardeenfanthandicape": { code: 10, name: "..." }, ... }

// Normalize string for fuzzy matching
const normalizeForMatching = (str) => {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "") // Remove accents
    .replace(/['"`_]/g, "") // Remove quotes and underscores
    .replace(/\s/g, "") // Remove spaces
    .replace(/s/g, "") // Remove 's'
    .replace(/-/g, ""); // Remove hyphens
};

// Initialize lookup maps at module load (runs once)
for (const [name, code] of Object.entries(ACTIVITY_CODES)) {
  // Reverse lookup for number matching
  if (!CODE_TO_NAME[code]) {
    CODE_TO_NAME[code] = name;
  }

  // Normalized lookup for fuzzy matching
  const normalized = normalizeForMatching(name);
  if (!NORMALIZED_TO_ACTIVITY[normalized]) {
    NORMALIZED_TO_ACTIVITY[normalized] = { code, name };
  }
}

// Special case mappings
NORMALIZED_TO_ACTIVITY["outiencolaire"] =
  NORMALIZED_TO_ACTIVITY["outiencolaireetcouradomicile"];

const POSSIBLE_FIELD_NAMES = [
  "codeNature",
  "activity",
  "activite",
  "activité",
  "type",
  "nature",
];

const validateActivityCode = (prestation, prestationNumber) => {
  const fieldName = getFieldName("codeNature", prestationNumber);

  // Find the field value
  const result = findDictValue(POSSIBLE_FIELD_NAMES, prestation);

  // Handle case where findDictValue returns null
  if (!result) {
    return {
      isValid: false,
      errorMessage: `[${fieldName}] n'est pas défini(e)`,
    };
  }

  const [value] = result;

  // Type validation (handles null/undefined and type checking)
  const typeValidation = validateStringField(value, fieldName, true);
  if (!typeValidation.isValid) {
    return typeValidation;
  }

  // Strategy 1: Match by number (O(1) lookup)
  const numValue = value * 1;
  if (Number.isInteger(numValue) && numValue !== 0 && CODE_TO_NAME[numValue]) {
    return {
      isValid: true,
      values: {
        codeNature: numValue,
        nomActivite: CODE_TO_NAME[numValue],
      },
    };
  }

  // Strategy 2: Fuzzy string match (O(1) lookup with normalized keys)
  const normalized = normalizeForMatching(value);
  if (NORMALIZED_TO_ACTIVITY[normalized]) {
    const { code, name } = NORMALIZED_TO_ACTIVITY[normalized];
    return {
      isValid: true,
      values: {
        codeNature: code,
        nomActivite: name,
      },
    };
  }

  // No match found
  return {
    isValid: false,
    errorMessage: `[${fieldName}] code activité non reconnu.`,
  };
};

module.exports = { validateActivityCode };
