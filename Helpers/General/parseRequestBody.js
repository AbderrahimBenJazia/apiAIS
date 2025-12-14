"use strict";

const { MESSAGES } = require("../Responses/messages");
const { createLogInfo } = require("../General/createLogInfo");
const record = require("../Database/record");
const { parsePagination } = require("../dataReader/parsePagination");

const parseRequestBody = (
  event,
  { ip, headers, userData },
  recordCollection
) => {
  if (!event.body) {
    return { body: {}, pagination: parsePagination({}) };
  }

  try {
    let requestBody =
      typeof event.body === "string" ? JSON.parse(event.body) : event.body;
    
    // If body is an array, take the first element
    if (Array.isArray(requestBody)) {
      requestBody = requestBody[0] || {};
    }
    
    const pagination = parsePagination(requestBody);
    
    // Remove pagination from body before returning (it's not a search filter)
    const { pagination: _, ...bodyWithoutPagination } = requestBody;

    return { body: bodyWithoutPagination, pagination };
  } catch (e) {
    const infos = createLogInfo({
      ip,
      request: recordCollection,
      professional: userData.professional,
      headers,
      error: MESSAGES.INVALID_BODY,
    });
    record(infos, recordCollection);
    throw new Error(MESSAGES.INVALID_BODY);
  }
};

module.exports = { parseRequestBody };
