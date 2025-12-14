"use strict";

const {
  extractRequestContext,
} = require("../General/extractRequestContext");
const { authUser } = require("../Auth/authUser");
const { getUrssafToken } = require("../Urssaf/getUrssafToken");
const { parseRequestBody } = require("../General/parseRequestBody");


const authenticateAndGetToken = async (event, handlerName) => {
  const { headers, ip } = extractRequestContext(event);

  // Authenticate user
  const authResponse = await authUser(headers);

  if (!authResponse.isAuthnenticated) {
    return {
      failed: true,
      response: authResponse.response,
    };
  }

  // Setup context
  const professional = authResponse.userData?.professional;
  const context = { ip, professional };

  // Parse request body
  const { body } = parseRequestBody(event, context, handlerName);

  // Get URSSAF credentials
  const { keyPublic, keyPrivate } = authResponse.userData?.urssaf || {};

  // Determine test mode
  const isTest = authResponse.userData?.abonnement?.licence === "test";

  // Get URSSAF token
  const tokenResponse = await getUrssafToken(keyPublic, keyPrivate, isTest);

  return {
    failed: false,
    context,
    body,
    authResponse,
    tokenResponse,
    isTest,
    professional,
  };
};

module.exports = { authenticateAndGetToken };
