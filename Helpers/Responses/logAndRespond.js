"use strict";

const { logActivity } = require("../General/logActivity");
const createApiResponse = require("../Responses/apiResponse");


const logAndRespond = async (
  handlerName,
  context,
  logData,
  userMessage,
  success = false,
  data = null
) => {
  await logActivity(context, handlerName, logData);
  return createApiResponse(success, data, userMessage);
};

module.exports = { logAndRespond };
