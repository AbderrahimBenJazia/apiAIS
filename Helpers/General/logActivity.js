"use strict";

const { createLogInfo } = require("./createLogInfo");
const record = require("../Database/record");
const logActivity = (context, recordCollection, additionalData = {}) => {
  const infos = createLogInfo({
    ...context,
    request: recordCollection,
    professional: context.userData?.professional,
    ...additionalData,
  });
  record(infos, recordCollection);
};

module.exports = { logActivity };
