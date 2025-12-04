"use strict";

const { validateCivilite } = require("./validators/validateCivilite");
const { validateNames } = require("./validators/validateNames");
const { validateContact } = require("./validators/validateContact");
const { validateBankingInfos } = require("./validators/validateBankingInfos");
const {
  validateResidenceAddress,
} = require("./validators/validateResidenceAddress");
const {
  validateBirthInformation,
} = require("./validators/validateBirthInformation");
const {
  validateOptionalFields,
} = require("./validators/validateOptionalFields");

const { validateBody } = require("../General/validateBody");

const { extractBodyValidFields } = require("../General/extractBodyValidFields");

const ALLOWED_FIELDS = [
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
  "info",
];

const checkCustomerBody = async (body) => {
  try {
    // 1. Validate input structure
    const inputCheck = validateBody(body);
    if (!inputCheck.isValid) return inputCheck;

    // 2. Extract and sanitize fields
    const cleanBody = extractBodyValidFields(body, ALLOWED_FIELDS);
    const validatedData = Object.create(null);

    // 3. Define validation pipeline
    const validations = [
      { fn: validateCivilite },
      { fn: validateNames },
      { fn: validateContact },
      { fn: validateBankingInfos },
      { fn: validateResidenceAddress, async: true },
      { fn: validateBirthInformation, async: true },
      { fn: validateOptionalFields, optional: true },
    ];

    // 4. Execute validation pipeline
    for (const validation of validations) {
      const result = validation.async
        ? await validation.fn(cleanBody)
        : validation.fn(cleanBody);

      if (!result.isValid) return result;

      // Handle different return formats
      if (validation.optional) {
        if (result.values?.cleExterneClient) {
          validatedData.cleExterneClient = result.values.cleExterneClient;
        }
      } else {
        Object.assign(validatedData, result.values);
      }
    }

    return { isValid: true, data: validatedData };
  } catch (error) {
    return {
      isValid: false,
      errorMessage: `[checkBody] erreur interne lors de la validation}`,
    };
  }
};

module.exports = { checkCustomerBody };
