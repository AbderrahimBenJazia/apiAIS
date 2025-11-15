"use strict";

const CONFIG = {
  TEST_URL: "https://api-edi.urssaf.fr/api/oauth/v1/token",
  PROD_URL: "https://api.urssaf.fr/api/oauth/v1/token",
};

const getUrssafUrl = (isTest = false) => {
  return isTest ? CONFIG.TEST_URL : CONFIG.PROD_URL;
};
module.exports = {
  getUrssafUrl,
};