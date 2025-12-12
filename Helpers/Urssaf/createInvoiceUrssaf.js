"use strict";

const axios = require("axios");
const { getUrssafUrl } = require("./getUrssafUrl");
const { handleUrssafErrors } = require("./handleUrssafErrors");

const defaultResponse = {
  success: false,
  idFacture: undefined,
  errorCode: undefined,
  errorMessage: undefined,
  errorDescription: undefined,
  status: undefined,
};

const createInvoiceUrssaf = async (urssafToken, invoiceInfos, isTest) => {
  const urlUrssaf = getUrssafUrl(isTest);
  const invoiceUrl = urlUrssaf + "/demandePaiement";

  let responseInfos = { ...defaultResponse };

  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: "Bearer " + urssafToken,
  };

  try {
    const responseUrssaf = await axios.post(invoiceUrl, [invoiceInfos], {
      headers,
    });

    if (responseUrssaf.status === 200) {
      // invoice creation failed
      if (responseUrssaf.data?.[0]?.errors) {
        const { code, message, description } = {
          ...responseUrssaf.data[0].errors[0],
        };
        responseInfos.errorCode = code;
        responseInfos.errorMessage = message;
        responseInfos.errorDescription = description;
      } else {
        responseInfos.idFacture = responseUrssaf.data?.[0]?.idDemandePaiement;
        responseInfos.success = true;
      }
    }
  } catch (error) {
    const status = error?.response?.status;

    // Handle different HTTP error status codes
    if (status === 401) {
      responseInfos.errorCode = "DENIED_URSSAF";
    } else if ([500, 503].includes(status)) {
      responseInfos.errorCode = "MAINTENANCE";
    } else if (status === 403) {
      responseInfos.errorCode = "NOT_AVAILABLE_URSSAF";
    } else if (status === 400) {
      const errorData = error.response?.data?.[0] || {};
      responseInfos.errorCode = errorData.code || "BAD_REQUEST";
      responseInfos.errorMessage = errorData.message;
    } else {
      // Network error or other issues
      responseInfos.errorCode = "INCONNUE";
      responseInfos.errorMessage = error?.message || "Unknown error";
    }

    responseInfos.error = error.message || error;
  }

  return responseInfos;
};

module.exports = { createInvoiceUrssaf };
