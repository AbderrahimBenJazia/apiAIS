"use strict";

const CONFIG = {
  TEST_URL_TOKEN: "https://api-edi.urssaf.fr/api/oauth/v1/token",
  PROD_URL_TOKEN: "https://api.urssaf.fr/api/oauth/v1/token",
  TEST_URL: "https://api-edi.urssaf.fr/atp/v1/tiersPrestations",
  PROD_URL: "https://api.urssaf.fr/atp/v1/tiersPrestations",
};

const getUrssafUrlToken = (isTest = false) => {
  return isTest ? CONFIG.TEST_URL_TOKEN : CONFIG.PROD_URL_TOKEN;
};

const getUrssafUrl = (isTest = false) => {
  return isTest ? CONFIG.TEST_URL : CONFIG.PROD_URL;
};

module.exports = {
  getUrssafUrlToken,
  getUrssafUrl,
};
