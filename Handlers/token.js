"use strict";

const { connectToDatabase } = require("../Helpers/Database/mongoConnexion");
const generateToken = require("../Helpers/Auth/generateToken");
const secureCompare = require("../Helpers/Auth/secureCompare");
const createApiResponse = require("../Helpers/Responses/apiResponse");
const { MESSAGES } = require("../Helpers/Responses/messages");
const { getHeaderValue } = require("../Helpers/General/normalizeHeaders");
const { tokenLogger } = require("../Helpers/General/tokenLogger");
const {
  extractRequestContext,
} = require("../Helpers/General/extractRequestContext");

const { validateAuthKeys } = require("../Helpers/Auth/validateAuthKeys");

async function createToken(event) {
  let headers = {};
  let ip = null;
  let keyPublic = null;
  let keyPrivate = null;

  try {
    const { ip, headers } = extractRequestContext(event);

    // Extract keys early for logging purposes (normalizeHeaders converts to Keypublic/Keyprivate format)
    keyPublic = getHeaderValue(headers.Keypublic);
    keyPrivate = getHeaderValue(headers.Keyprivate);

    // Validate authentication keys
    const validation = validateAuthKeys(keyPublic, keyPrivate);

    if (!validation.valid) {
      await tokenLogger(ip, headers, "failedtoken", {
        keyPublic,
        keyPrivate,
        error: validation?.error?.message,
      });
      return validation.error;
    }

    // Connect to MongoDB
    const client = await connectToDatabase();
    const db = client.db("providerDB");

    // Check user exists
    const userData = await db
      .collection("professional")
      .findOne(
        { "api.keyPublic": keyPublic },
        { projection: { api: 1, _id: 1, professional: 1 } }
      );

    const { api } = userData || {};

    const { professional } = userData || {};

    // Use secure comparison to prevent timing attacks
    const isValidCredentials = secureCompare(keyPrivate, api?.keyPrivate);

    if (!isValidCredentials) {
      await tokenLogger(ip, headers, "failedtoken", {
        keyPublic,
        keyPrivate,
        error: "Invalid private key",
      });

      return createApiResponse(false, null, MESSAGES.INVALID_CREDENTIALS);
    }

    // Token management
    let token = api.token;
    let tokenDate = api.tokenDate;
    let tokenAge = new Date() - new Date(tokenDate);

    // If token needs to be refreshed or created (30 minutes = 1000*60*30)
    if (tokenDate === undefined || tokenAge > 1000 * 60 * 30) {
      token = generateToken("AIS_", 50);

      // Update professional token
      await db
        .collection("professional")
        .updateOne(
          { professional: userData.professional },
          { $set: { "api.token": token, "api.tokenDate": new Date() } }
        );
      // only to ensure backward compatibility the time of migration (to be removed once service is 100% in AWS)
      await db
        .collection("user")
        .updateOne(
          { professional: professional },
          { $set: { token: token, tokenDate: new Date() } }
        );
    }

    await tokenLogger(ip, headers, "token", { professional });

    return createApiResponse(true, token, MESSAGES.SUCCESSFUL_AUTHENTICATION);
  } catch (e) {
    // For debugging purposes, log more details in the bugs collection
    await tokenLogger(ip, headers, "bugs", {
      keyPublic,
      keyPrivate,
      error: e.message || e,
    });

    // Return generic error message to prevent information leakage
    return createApiResponse(false, null, MESSAGES.INTERNAL_ERROR);
  }
}

module.exports = { createToken };
