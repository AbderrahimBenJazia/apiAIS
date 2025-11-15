"use strict";

const { createLogInfo } = require("./createLogInfo");
const record = require("../Database/record");

const tokenLogger = (ip, headers, collection, additionalData = {}) => {
  const infos = createLogInfo({
    ip,
    request: "token",
    headers,
    ...additionalData,
  });
  record(infos, collection);
};

module.exports = { tokenLogger };
