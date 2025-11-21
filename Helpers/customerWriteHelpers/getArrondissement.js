"use strict";
// Postal code to arrondissement mapping (O(1) lookup)
const POSTAL_CODE_MAP = new Map([
  // Paris (75001-75020)
  [
    75001,
    {
      codePostal: 75001,
      nom: "PARIS 01",
      nomSearch: "Paris1",
      COG: "75101",
      codeCommune: "101",
      departement: "75",
    },
  ],
  [
    75002,
    {
      codePostal: 75002,
      nom: "PARIS 02",
      nomSearch: "Paris2",
      COG: "75102",
      codeCommune: "102",
      departement: "75",
    },
  ],
  [
    75003,
    {
      codePostal: 75003,
      nom: "PARIS 03",
      nomSearch: "Paris3",
      COG: "75103",
      codeCommune: "103",
      departement: "75",
    },
  ],
  [
    75004,
    {
      codePostal: 75004,
      nom: "PARIS 04",
      nomSearch: "Paris4",
      COG: "75104",
      codeCommune: "104",
      departement: "75",
    },
  ],
  [
    75005,
    {
      codePostal: 75005,
      nom: "PARIS 05",
      nomSearch: "Paris5",
      COG: "75105",
      codeCommune: "105",
      departement: "75",
    },
  ],
  [
    75006,
    {
      codePostal: 75006,
      nom: "PARIS 06",
      nomSearch: "Paris6",
      COG: "75106",
      codeCommune: "106",
      departement: "75",
    },
  ],
  [
    75007,
    {
      codePostal: 75007,
      nom: "PARIS 07",
      nomSearch: "Paris7",
      COG: "75107",
      codeCommune: "107",
      departement: "75",
    },
  ],
  [
    75008,
    {
      codePostal: 75008,
      nom: "PARIS 08",
      nomSearch: "Paris8",
      COG: "75108",
      codeCommune: "108",
      departement: "75",
    },
  ],
  [
    75009,
    {
      codePostal: 75009,
      nom: "PARIS 09",
      nomSearch: "Paris9",
      COG: "75109",
      codeCommune: "109",
      departement: "75",
    },
  ],
  [
    75010,
    {
      codePostal: 75010,
      nom: "PARIS 10",
      nomSearch: "Paris10",
      COG: "75110",
      codeCommune: "110",
      departement: "75",
    },
  ],
  [
    75011,
    {
      codePostal: 75011,
      nom: "PARIS 11",
      nomSearch: "Paris11",
      COG: "75111",
      codeCommune: "111",
      departement: "75",
    },
  ],
  [
    75012,
    {
      codePostal: 75012,
      nom: "PARIS 12",
      nomSearch: "Paris12",
      COG: "75112",
      codeCommune: "112",
      departement: "75",
    },
  ],
  [
    75013,
    {
      codePostal: 75013,
      nom: "PARIS 13",
      nomSearch: "Paris13",
      COG: "75113",
      codeCommune: "113",
      departement: "75",
    },
  ],
  [
    75014,
    {
      codePostal: 75014,
      nom: "PARIS 14",
      nomSearch: "Paris14",
      COG: "75114",
      codeCommune: "114",
      departement: "75",
    },
  ],
  [
    75015,
    {
      codePostal: 75015,
      nom: "PARIS 15",
      nomSearch: "Paris15",
      COG: "75115",
      codeCommune: "115",
      departement: "75",
    },
  ],
  [
    75016,
    {
      codePostal: 75016,
      nom: "PARIS 16",
      nomSearch: "Paris16",
      COG: "75116",
      codeCommune: "116",
      departement: "75",
    },
  ],
  [
    75017,
    {
      codePostal: 75017,
      nom: "PARIS 17",
      nomSearch: "Paris17",
      COG: "75117",
      codeCommune: "117",
      departement: "75",
    },
  ],
  [
    75018,
    {
      codePostal: 75018,
      nom: "PARIS 18",
      nomSearch: "Paris18",
      COG: "75118",
      codeCommune: "118",
      departement: "75",
    },
  ],
  [
    75019,
    {
      codePostal: 75019,
      nom: "PARIS 19",
      nomSearch: "Paris19",
      COG: "75119",
      codeCommune: "119",
      departement: "75",
    },
  ],
  [
    75020,
    {
      codePostal: 75020,
      nom: "PARIS 20",
      nomSearch: "Paris20",
      COG: "75120",
      codeCommune: "120",
      departement: "75",
    },
  ],

  // Lyon (69001-69009)
  [
    69001,
    {
      codePostal: 69001,
      nom: "LYON 01",
      nomSearch: "Lyon1",
      COG: "69381",
      codeCommune: "381",
      departement: "69",
    },
  ],
  [
    69002,
    {
      codePostal: 69002,
      nom: "LYON 02",
      nomSearch: "Lyon2",
      COG: "69382",
      codeCommune: "382",
      departement: "69",
    },
  ],
  [
    69003,
    {
      codePostal: 69003,
      nom: "LYON 03",
      nomSearch: "Lyon3",
      COG: "69383",
      codeCommune: "383",
      departement: "69",
    },
  ],
  [
    69004,
    {
      codePostal: 69004,
      nom: "LYON 04",
      nomSearch: "Lyon4",
      COG: "69384",
      codeCommune: "384",
      departement: "69",
    },
  ],
  [
    69005,
    {
      codePostal: 69005,
      nom: "LYON 05",
      nomSearch: "Lyon5",
      COG: "69385",
      codeCommune: "385",
      departement: "69",
    },
  ],
  [
    69006,
    {
      codePostal: 69006,
      nom: "LYON 06",
      nomSearch: "Lyon6",
      COG: "69386",
      codeCommune: "386",
      departement: "69",
    },
  ],
  [
    69007,
    {
      codePostal: 69007,
      nom: "LYON 07",
      nomSearch: "Lyon7",
      COG: "69387",
      codeCommune: "387",
      departement: "69",
    },
  ],
  [
    69008,
    {
      codePostal: 69008,
      nom: "LYON 08",
      nomSearch: "Lyon8",
      COG: "69388",
      codeCommune: "388",
      departement: "69",
    },
  ],
  [
    69009,
    {
      codePostal: 69009,
      nom: "LYON 09",
      nomSearch: "Lyon9",
      COG: "69389",
      codeCommune: "389",
      departement: "69",
    },
  ],

  // Marseille (13001-13016)
  [
    13001,
    {
      codePostal: 13001,
      nom: "MARSEILLE 01",
      nomSearch: "Marseille1",
      COG: "13201",
      codeCommune: "201",
      departement: "13",
    },
  ],
  [
    13002,
    {
      codePostal: 13002,
      nom: "MARSEILLE 02",
      nomSearch: "Marseille2",
      COG: "13202",
      codeCommune: "202",
      departement: "13",
    },
  ],
  [
    13003,
    {
      codePostal: 13003,
      nom: "MARSEILLE 03",
      nomSearch: "Marseille3",
      COG: "13203",
      codeCommune: "203",
      departement: "13",
    },
  ],
  [
    13004,
    {
      codePostal: 13004,
      nom: "MARSEILLE 04",
      nomSearch: "Marseille4",
      COG: "13204",
      codeCommune: "204",
      departement: "13",
    },
  ],
  [
    13005,
    {
      codePostal: 13005,
      nom: "MARSEILLE 05",
      nomSearch: "Marseille5",
      COG: "13205",
      codeCommune: "205",
      departement: "13",
    },
  ],
  [
    13006,
    {
      codePostal: 13006,
      nom: "MARSEILLE 06",
      nomSearch: "Marseille6",
      COG: "13206",
      codeCommune: "206",
      departement: "13",
    },
  ],
  [
    13007,
    {
      codePostal: 13007,
      nom: "MARSEILLE 07",
      nomSearch: "Marseille7",
      COG: "13207",
      codeCommune: "207",
      departement: "13",
    },
  ],
  [
    13008,
    {
      codePostal: 13008,
      nom: "MARSEILLE 08",
      nomSearch: "Marseille8",
      COG: "13208",
      codeCommune: "208",
      departement: "13",
    },
  ],
  [
    13009,
    {
      codePostal: 13009,
      nom: "MARSEILLE 09",
      nomSearch: "Marseille9",
      COG: "13209",
      codeCommune: "209",
      departement: "13",
    },
  ],
  [
    13010,
    {
      codePostal: 13010,
      nom: "MARSEILLE 10",
      nomSearch: "Marseille10",
      COG: "13210",
      codeCommune: "210",
      departement: "13",
    },
  ],
  [
    13011,
    {
      codePostal: 13011,
      nom: "MARSEILLE 11",
      nomSearch: "Marseille11",
      COG: "13211",
      codeCommune: "211",
      departement: "13",
    },
  ],
  [
    13012,
    {
      codePostal: 13012,
      nom: "MARSEILLE 12",
      nomSearch: "Marseille12",
      COG: "13212",
      codeCommune: "212",
      departement: "13",
    },
  ],
  [
    13013,
    {
      codePostal: 13013,
      nom: "MARSEILLE 13",
      nomSearch: "Marseille13",
      COG: "13213",
      codeCommune: "213",
      departement: "13",
    },
  ],
  [
    13014,
    {
      codePostal: 13014,
      nom: "MARSEILLE 14",
      nomSearch: "Marseille14",
      COG: "13214",
      codeCommune: "214",
      departement: "13",
    },
  ],
  [
    13015,
    {
      codePostal: 13015,
      nom: "MARSEILLE 15",
      nomSearch: "Marseille15",
      COG: "13215",
      codeCommune: "215",
      departement: "13",
    },
  ],
  [
    13016,
    {
      codePostal: 13016,
      nom: "MARSEILLE 16",
      nomSearch: "Marseille16",
      COG: "13216",
      codeCommune: "216",
      departement: "13",
    },
  ],
]);

// City name to department mapping (for bulk searches)
const CITY_DEPARTMENTS = {
  PARIS: "75",
  LYON: "69",
  MARSEILLE: "13",
};

// Helper function to normalize city name input
const normalizeQuery = (input) => {
  if (!input) return null;

  let normalized = input.toString().trim().toUpperCase();

  // Remove spaces and normalize arrondissement format
  // "PARIS 01" → "PARIS1", "Lyon 09" → "LYON9"
  normalized = normalized.replace(/\s+/g, "");

  // Convert leading zero format: "PARIS01" → "PARIS1"
  if (normalized.length >= 3) {
    const lastTwoChars = normalized.slice(-2);
    if (lastTwoChars[0] === "0" && /[1-9]/.test(lastTwoChars[1])) {
      normalized = normalized.slice(0, -2) + lastTwoChars[1];
    }
  }

  return normalized;
};

const getArrondissement = (query) => {
  try {
    // Input validation
    if (query == null) return [];

    // Handle numeric postal code input
    const numericQuery = parseInt(query);
    if (!isNaN(numericQuery) && numericQuery > 0) {
      const result = POSTAL_CODE_MAP.get(numericQuery);
      if (result) {
        return [{ ...result, source: "arrondissement" }];
      }
      return [];
    }

    // Handle string city name input
    const normalizedQuery = normalizeQuery(query);
    if (!normalizedQuery) return [];

    // Check for exact arrondissement match first
    for (const [postalCode, arrond] of POSTAL_CODE_MAP) {
      if (arrond.nomSearch.toUpperCase() === normalizedQuery) {
        return [{ ...arrond, source: "arrondissement" }];
      }
    }

    // Check for city name match (return all arrondissements)
    for (const [cityName, department] of Object.entries(CITY_DEPARTMENTS)) {
      if (
        normalizedQuery === cityName ||
        normalizedQuery.startsWith(cityName)
      ) {
        const cityArrondissements = [];

        for (const [postalCode, arrond] of POSTAL_CODE_MAP) {
          if (arrond.departement === department) {
            cityArrondissements.push({ ...arrond, source: "arrondissement" });
          }
        }

        // Sort by postal code for consistent ordering
        return cityArrondissements.sort((a, b) => a.codePostal - b.codePostal);
      }
    }

    return [];
  } catch (error) {
    console.error(
      `[getArrondissement] Error processing query "${query}":`,
      error.message
    );
    return [];
  }
};

module.exports = { getArrondissement };
