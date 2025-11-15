"use strict";

const { connectToDatabase } = require("../Database/mongoConnexion");
const createApiResponse = require("../Responses/apiResponse");

const { MESSAGES } = require("../Responses/messages");
const { authUser } = require("../Auth/authUser");
const { extractRequestContext } = require("../General/extractRequestContext");
const { queryData } = require("../dataReader/queryData");
const { parseRequestBody } = require("../General/parseRequestBody");
const {
  validateAndSanitizeSearch,
} = require("../dataReader/validateAndSanitizeSearch");

const { buildDataResponse } = require("../dataReader/buildDataResponse");
const { logActivity } = require("../General/logActivity");

async function getData(event, { readCollection, logCollection, projection }) {
  const { headers, ip } = extractRequestContext(event);

  let context = { ip, userData: null };

  try {
    const authResponse = await authUser(headers);

    if (!authResponse.isAuthnenticated) {
      return authResponse.response;
    }

    context = { ip, professional: authResponse.userData.professional };

    const { body, pagination } = parseRequestBody(
      event,
      context,
      logCollection
    );

    let sanitizedFilter = validateAndSanitizeSearch(
      body,
      Object.keys(projection),
      logCollection,
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
      readCollection,
      sanitizedFilter,
      projection,
      pagination
    );

    await logActivity(context, logCollection, {
      body,
      pagination,
      resultsCount: data.length,
      totalRecords: totalCount,
    });

    // 10. Build and return response
    const { data: responseData, pagination: paginationMeta } =
      buildDataResponse(data, pagination, totalCount);
    return createApiResponse(
      true,
      responseData,
      "Data imported with success.",
      paginationMeta
    );
  } catch (error) {
    // Handle all errors in one place
    await logActivity(context, logCollection, {
      body: JSON.parse(event.body),
      error: error.message || error,
    });

    // Return appropriate error response
    const isValidationError =
      error.message === MESSAGES.INVALID_BODY ||
      error.message.includes("No valid search criteria");

    return createApiResponse(
      false,
      [],
      isValidationError
        ? error.message
        : `[${logCollection}] ${MESSAGES.INTERNAL_ERROR}`
    );
  }
}
module.exports = { getData };
