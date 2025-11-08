"use strict";

const { connectToDatabase } = require("../Helpers/Database/mongoConnexion");
const generateToken = require("../Helpers/Auth/generateToken");
const secureCompare = require("../Helpers/Auth/secureCompare");
const createApiResponse = require("../Helpers/Responses/apiResponse");
const record = require("../Helpers/Database/record");
const { normalizeHeaders } = require("../Helpers/General/normalizeHeaders");
const { MESSAGES } = require("../Helpers/Responses/messages");
const { getHeaderValue } = require("../Helpers/General/normalizeHeaders");

const validateAuthKeys = (keyPublic, keyPrivate) => {
  // Check if required headers exist
  if (keyPublic === undefined || keyPrivate === undefined) {
    return {
      valid: false,
      error: createApiResponse(false, null, MESSAGES.NO_KEYS_PROVIDED),
    };
  }

  // Validate that keys are strings and not empty
  if (typeof keyPublic !== "string" || typeof keyPrivate !== "string") {
    return {
      valid: false,
      error: createApiResponse(false, null, MESSAGES.INVALID_CREDENTIALS),
    };
  }

  if (keyPublic.trim() === "" || keyPrivate.trim() === "") {
    return {
      valid: false,
      error: createApiResponse(false, null, MESSAGES.INVALID_CREDENTIALS),
    };
  }

  return {
    valid: true,
    keyPublic: keyPublic.trim(),
    keyPrivate: keyPrivate.trim(),
    error: null,
  };
};

function sanitizeHeaders(headers) {
  const sanitized = { ...headers };
  delete sanitized.Keypublic;
  delete sanitized.Keyprivate;
  delete sanitized.Authorization;

  return sanitized;
}

async function createToken(event) {
  let headers = {};
  let ip = null;
  let keyPublic = null;
  let keyPrivate = null;

  try {
    headers = { ...event.headers };
    ip = headers["x-forwarded-for"] || headers["X-Forwarded-For"];

    headers = normalizeHeaders(headers);

    // Extract keys early for logging purposes (normalizeHeaders converts to Keypublic/Keyprivate format)
    keyPublic = getHeaderValue(headers.Keypublic);
    keyPrivate = getHeaderValue(headers.Keyprivate);

    // Validate authentication keys
    const validation = validateAuthKeys(keyPublic, keyPrivate);

    if (!validation.valid) {
      const infos = {
        ip,
        request: "token",
        keyPublic,
        keyPrivate,
        date: new Date(),
      };
      record(infos, "failedtoken");
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
      const infos = {
        ip,
        request: "token",
        keyPublic,
        keyPrivate, // Log keyPrivate for security monitoring and debugging
        date: new Date(),
      };

      record(infos, "failedtoken");

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

    const infos = {
      ip,
      request: "token",
      headers: sanitizeHeaders(headers), // Sanitize headers before logging
      error: undefined,
      professional: professional || null,
    };

    record(infos, "token");

    return createApiResponse(true, token, MESSAGES.SUCCESSFUL_AUTHENTICATION);
  } catch (e) {
    // For debugging purposes, log more details in the bugs collection
    // Extract keys if they exist for debugging
    const infos = {
      ip: ip || null,
      request: "token",
      keyPublic,
      keyPrivate,
      headers: sanitizeHeaders(headers || {}),
      error: e.message || e,
    };

    record(infos, "bugs");

    // Return generic error message to prevent information leakage
    return createApiResponse(false, null, MESSAGES.INTERNAL_ERROR);
  }
}

module.exports = { createToken };
