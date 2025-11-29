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

  try {
    const response = await axios.get(url, {
      headers,
    });

    const status = handleUrssafStatus(response.data.statut);
    return { success: true, status, idClient };
  } catch {
    return { success: false, status: undefined, idClient };
  }
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
