"use strict";

const { getUrssafUrl } = require("./getUrssafUrl");
const axios = require("axios");

const getClientStatusUrssaf = async (urssafToken, idClient, isTest) => {
  const baseUrl = getUrssafUrl(isTest);
  const url = `${baseUrl}/particulier?idClient=${idClient}`;

  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: "Bearer " + urssafToken,
  };

  const responseInfos = {
    success: false,
    status: undefined,
    idClient,
    error: null,
    errorCode: undefined,
    errorMessage: undefined,
  };

  try {
    const response = await axios.get(url, { headers });

    // Success: 2xx status codes
    const statusClient = handleUrssafStatus(response.data.statut);
    responseInfos.success = true;
    responseInfos.status = statusClient;
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

const handleUrssafStatus = (status) => {
  const regex = "[0-9]{2}/[0-9]{2}/[0-9]{4}";

  const clientStatus = {
    etat: "",
    code: status?.code || "ERR_STATUS",
    dateAcceptation: "",
  };

  if (status.etat === "OK") {
    const match = status.description.match(regex);
    clientStatus.etat = "Compte Validé";
    if (match) {
      clientStatus.dateAcceptation = match[0].replaceAll("/", "-");
    }
  } else if (status.code === "PARTICULIER_BLOQUE") {
    clientStatus.etat = "Bloqué";
  } else if (
    status.code === "APPAREILLAGE_EC" ||
    status.code === "APPAREILLAGE_NF"
  ) {
    clientStatus.etat = "Compte en cours de validation";
  }

  return clientStatus;
};

module.exports = { getClientStatusUrssaf };
