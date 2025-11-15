"use strict";

const { createLogInfo } = require("./createLogInfo");
const record = require("../Database/record");
const logActivity = async (context, recordCollection, additionalData = {}) => {
  const infos = createLogInfo({
    ...context,
    request: recordCollection,
    ...additionalData,
  });
 await record(infos, recordCollection);
};

module.exports = { logActivity };
