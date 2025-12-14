"use strict";

const { logAndRespond } = require("../Responses/logAndRespond");


const handleValidationError = async (
  handlerName,
  context,
  errorType,
  errorMessage,
  additionalData = {}
) => {
  return await logAndRespond(
    handlerName,
    context,
    {
      error: errorMessage,
      type: errorType,
      userMessage: errorMessage,
      ...additionalData,
    },
    errorMessage
  );
};

module.exports = { handleValidationError };
