"use strict";

// Export all validation functions for easy import
const { validateCivilite } = require("./validateCivilite");
const { validateNames } = require("./validateNames");
const { validateContact } = require("./validateContact");
const { validateBanking } = require("./validateBanking");
const { validateResidenceAddress } = require("./validateResidenceAddress");
const { validateBirthInformation } = require("./validateBirthInformation");
const { validateOptionalFields } = require("./validateOptionalFields");

/**
 * Validates and normalizes customer data for URSSAF registration.
 * @param {Object} body - Customer data to validate
 * @param {Object} userData - User context data (contains keyPublic for duplicate checking)
 * @returns {Promise<Object>} - { isValid: boolean, errorMessage?: string, data?: Object }
 */
const checkBody = async (body, userData) => {
  try {
    // Input validation - Security enhancement
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return {
        isValid: false,
        errorMessage:
          "[checkBody] Le corps doit être un objet valide. Les tableaux et valeurs nulles ne sont pas acceptés.",
      };
    }

    // Prevent prototype pollution by creating clean object
    const cleanBody = Object.create(null);
    const allowedFields = [
      "civilite",
      "nomNaissance",
      "nomUsage",
      "prenoms",
      "numeroTelephonePortable",
      "adresseMail",
      "bic",
      "iban",
      "titulaire",
      "libelleVoie",
      "codePays",
      "codePostal",
      "libelleCommune",
      "libelleCommuneResidence",
      "dateNaissance",
      "codePaysNaissance",
      "libelleCommuneNaissance",
      "cleExterneClient",
    ];

    // Safely copy only allowed fields
    for (const field of allowedFields) {
      if (body.hasOwnProperty(field)) {
        cleanBody[field] = body[field];
      }
    }

    // Create result object to collect normalized values
    const validatedData = Object.create(null);

    // 1. PERSONAL INFORMATION
    let result = validateCivilite(cleanBody.civilite);
    if (!result.isValid) return result;
    validatedData.civilite = result.value;

    result = validateNames(cleanBody);
    if (!result.isValid) return result;
    // Direct assignment - much clearer and faster
    validatedData.nomNaissance = result.values.nomNaissance;
    validatedData.nomUsage = result.values.nomUsage;
    validatedData.prenoms = result.values.prenoms;

    result = validateContact(cleanBody, userData);
    if (!result.isValid) return result;
    // Direct assignment - explicit and efficient
    validatedData.numeroTelephonePortable =
      result.values.numeroTelephonePortable;
    validatedData.adresseMail = result.values.adresseMail;

    // 2. BANKING INFORMATION
    // Create banking input with spread syntax - cleaner and more readable
    const bankingInput = {
      ...cleanBody,
      civilite: validatedData.civilite,
      nomUsage: validatedData.nomUsage,
    };
    result = validateBanking(bankingInput);
    if (!result.isValid) return result;
    // Direct assignment for banking fields
    validatedData.bic = result.values.bic;
    validatedData.iban = result.values.iban;
    validatedData.titulaire = result.values.titulaire;

    // 3. RESIDENCE ADDRESS
    result = await validateResidenceAddress(cleanBody);
    if (!result.isValid) return result;
    // Direct assignment - clear and performant
    validatedData.adresseLigne1 = result.values.adresseLigne1;
    validatedData.adresseLigne2 = result.values.adresseLigne2;
    validatedData.codePostal = result.values.codePostal;
    validatedData.ville = result.values.ville;
    validatedData.codeInseeCommune = result.values.codeInseeCommune;
    validatedData.codePays = result.values.codePays;

    // 4. BIRTH INFORMATION
    result = await validateBirthInformation(cleanBody);
    if (!result.isValid) return result;
    // Direct assignment for birth fields
    validatedData.dateNaissance = result.values.dateNaissance;
    validatedData.communeNaissance = result.values.communeNaissance;
    validatedData.codePaysNaissance = result.values.codePaysNaissance;

    // 5. OPTIONAL FIELDS
    result = validateOptionalFields(cleanBody);
    if (!result.isValid) return result;
    if (result.values?.cleExterneClient) {
      validatedData.cleExterneClient = result.values.cleExterneClient;
    }

    return { isValid: true, data: validatedData };
  } catch (error) {
    return {
      isValid: false,
      errorMessage: `[checkBody] ${error.message || error}`,
    };
  }
};

module.exports = { checkBody };
