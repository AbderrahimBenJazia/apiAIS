"use strict";

const { connectToDatabase } = require("../Helpers/Database/mongoConnexion");
const createApiResponse = require("../Helpers/Responses/apiResponse");
const record = require("../Helpers/Database/record");
const { MESSAGES } = require("../Helpers/Responses/messages");
const { authUser } = require("../Helpers/Auth/authUser");
const { createLogInfo } = require("../Helpers/General/createLogInfo");
const {
  extractRequestContext,
} = require("../Helpers/General/extractRequestContext");
const { queryData } = require("../Helpers/dataReader/queryData");
const { parseRequestBody } = require("../Helpers/General/parseRequestBody");
const {
  validateAndSanitizeSearch,
} = require("../Helpers/dataReader/validateAndSanitizeSearch");

const {
  buildDataResponse,
} = require("../Helpers/dataReader/buildDataResponse");
const customerProjection = {
  civilite: 1,
  prenoms: 1,
  nomNaissance: 1,
  nomUsage: 1,
  adresseMail: 1,
  numeroTelephonePortable: 1,
  dateNaissance: 1,
  lieuNaissancePaysCode: 1,
  lieuNaissanceDepartementCode: 1,
  lieuNaissanceCommuneCode: 1,
  lieuNaissanceCommuneLibelle: 1,
  adressePostaleVoieNumero: 1,
  adressePostaleVoieLettre: 1,
  adressePostaleVoieCode: 1,
  adressePostaleVoieLibelle: 1,
  adressePostaleComplement: 1,
  adressePostaleLieuDit: 1,
  adressePostaleCodePostal: 1,
  adressePostaleCommuneLibelle: 1,
  modeInscription: 1,
  statusUrssaf: 1,
  subscriptionDate: 1,
  date: 1,
  cleExterneClient: 1,
};

/**
 * Log request activity
 */
function logActivity(context, recordCollection, additionalData = {}) {
  const infos = createLogInfo({
    ...context,
    request: recordCollection,
    professional: context.userData?.professional,
    ...additionalData,
  });
  record(infos, recordCollection);
}

/**
 * Main customerRead function - now much cleaner and focused
 */
async function customerRead(event) {
  let context = {};

  try {
    const { headers, ip } = extractRequestContext(event);

    const authResponse = await authUser(headers);

    if (!authResponse.isAuthnenticated) {
      return authResponse.response;
    }

    context = { ip, headers, userData: authResponse.userData };

    const { body, pagination } = parseRequestBody(
      event,
      context,
      "customerRead"
    );

    let sanitizedFilter = validateAndSanitizeSearch(
      body,
      Object.keys(customerProjection),
      "customerRead",
      context
    );

    sanitizedFilter = {
      ...sanitizedFilter,
      professional: authResponse.userData.professional,
      status: null,
    };

    const client = await connectToDatabase();
    const db = client.db("providerDB");

    const { data, totalCount } = await queryData(
      db,
      "customer",
      sanitizedFilter,
      customerProjection,
      pagination
    );

    logActivity(context, "customerRead", {
      body: sanitizedFilter,
      pagination,
      resultsCount: data.length,
      totalRecords: totalCount,
    });

    // 10. Build and return response
    const response = buildDataResponse(data, pagination, totalCount);
    return createApiResponse(true, response, "Data imported with success.");
  } catch (error) {
    // Handle all errors in one place
    logActivity(context, "customerRead", {
      body: event.body,
      error: error.message || error,
    });

    // Return appropriate error response
    const isValidationError =
      error.message === MESSAGES.INVALID_BODY ||
      error.message.includes("No valid search criteria");

    return createApiResponse(
      false,
      null,
      isValidationError
        ? error.message
        : `[customerRead] ${MESSAGES.INTERNAL_ERROR}`
    );
  }
}

// Test function (simplified)
const main = async () => {
  const event = {
    headers: {
      token: "AIS_85GCHA2EVNBjCLoSuzAhCXGBpuFMJqiiIX12autGtdYmDwzGLX",
      "content-type": "application/json",
      "user-agent": "test-client",
    },
    body: JSON.stringify({ test: "test" }),
  };

  let response = await customerRead(event);

  const myData = JSON.parse(response.body);

  console.log(myData.data);
};
main();

module.exports = { customerRead };
