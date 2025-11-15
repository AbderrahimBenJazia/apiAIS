"use strict";

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

module.exports = { validateAuthKeys };
