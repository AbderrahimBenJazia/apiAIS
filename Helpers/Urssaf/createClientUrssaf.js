"use strict";

const axios = require("axios");
const { getUrssafUrl } = require("./getUrssafUrl");
const { getClientStatusUrssaf } = require("./getClientStatusUrssaf");
const { handleUrssafErrors } = require("./handleUrssafErrors");
const defaultResponse = {
  success: false,
  urssafKeyCustomer: undefined,
  errorCode: undefined,
  errorMessage: undefined,
  errorDescription: undefined,
  status: undefined,
};

const manageCreationRequest = async (urlUrssaf, clientInfos, headers) => {
  const responseInfos = { ...defaultResponse };

  try {
    const response = await axios.post(urlUrssaf, clientInfos, { headers });

    // Success: Extract client ID from any 2xx response
    if (response.status >= 200 && response.status < 300) {
      responseInfos.urssafKeyCustomer = response.data?.idClient;
      
      if (!responseInfos.urssafKeyCustomer) {
        responseInfos.errorCode = "MISSING_ID_CLIENT";
        responseInfos.errorDescription = "URSSAF did not return idClient";
      }
    }
  } catch (error) {
    const status = error?.response?.status;

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
      responseInfos.errorDescription = errorData.description;
    } else {
      responseInfos.errorCode = "INCONNUE";
      responseInfos.errorDescription = error?.message || "Unknown error";
    }
  }

  if (responseInfos.errorMessage) {
    responseInfos.errorMessage = handleUrssafErrors(responseInfos);
  }

  return responseInfos;
};

const createClientUrssaf = async (urssafToken, clientInfos, isTest) => {
  const urlUrssaf = getUrssafUrl(isTest);
  const clientUrl = urlUrssaf + "/particulier";

  let response = { ...defaultResponse };

  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: "Bearer " + urssafToken,
  };

  try {
    const responseUrssaf = await manageCreationRequest(
      clientUrl,
      clientInfos,
      headers
    );

    response = { ...response, ...responseUrssaf };

    // Client is only considered successfully created if we have a key AND valid status
    if (response.urssafKeyCustomer) {
      const statusResult = await getClientStatusUrssaf(
        urssafToken,
        response.urssafKeyCustomer,
        isTest
      );

      response.status = statusResult.status;

      // Success only when status check succeeds
      if (statusResult.success) {
        response.success = true;
      } else {
        // Status check failed - override creation success
        response.errorCode = statusResult.errorCode || "NON_INSCRIPTION";
        response.errorMessage = statusResult.errorMessage;
      }
    }
  } catch (error) {
    response.errorCode = "INTERNE";
    response.errorDescription = error?.message || error;
  }

  return response;
};

module.exports = { createClientUrssaf };
