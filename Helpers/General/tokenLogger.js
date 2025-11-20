"use strict";

const { createLogInfo } = require("./createLogInfo");
const record = require("../Database/record");

const tokenLogger = async (ip, headers, collection, additionalData = {}) => {
  const infos = createLogInfo({
    ip,
    request: "token",
    headers,
    ...additionalData,
  });
  await record(infos, collection);
};

module.exports = { tokenLogger };
