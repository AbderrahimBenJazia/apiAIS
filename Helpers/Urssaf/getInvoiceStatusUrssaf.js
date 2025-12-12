"use strict";

const axios = require("axios");
const { getUrssafUrl } = require("../Urssaf/getUrssafUrl");

const checkUrssafInvoiceStatusHelper = async (token, searchParams, isTest) => {
  let responseUrssaf = {
    success: false,
    idDemandePaiement: undefined,
    statut: undefined,
    infoVirement: undefined,
    infoRejet: undefined,
    errorMessage: undefined,
  };

  const baseUrl = getUrssafUrl(isTest);
  const url = baseUrl + "/demandePaiement/rechercher";

  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: "Bearer " + token,
  };

  try {
    const response = await axios.post(url, searchParams, { headers });
    const data = response?.data?.infoDemandePaiements?.[0];

    if (data) {
      responseUrssaf = { ...responseUrssaf, ...data };
      responseUrssaf.success = true;
    }
  } catch (error) {
    responseUrssaf.errorMessage = error.message || "Unknown error";
  }

  return responseUrssaf;
};

const checkInvoiceStatusByNum = async (token, numFacture, license) => {
  const searchParams = {
    numFactureTiers: [numFacture],
  };

  return await checkUrssafInvoiceStatusHelper(token, searchParams, license);
};

const checkInvoiceStatusById = async (token, idDemandePaiement, license) => {
  const searchParams = {
    idDemandePaiements: [idDemandePaiement],
  };

  return await checkUrssafInvoiceStatusHelper(token, searchParams, license);
};

module.exports = {
  checkInvoiceStatusByNum,
  checkInvoiceStatusById,
};
