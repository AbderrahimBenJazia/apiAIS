"use strict";

const axios = require("axios");
const { getUrssafUrl } = require("./getUrssafUrl");
const { handleUrssafErrors } = require("./handleUrssafErrors");
const { checkInvoiceStatusByNum } = require("./getInvoiceStatusUrssaf");

const defaultResponse = {
  success: false,
  idFacture: undefined,
  errorCode: undefined,
  errorMessage: undefined,
  errorDescription: undefined,
  status: undefined,
};

const manageInvoiceRequest = async (urlUrssaf, invoiceInfos, headers) => {
  const responseInfos = { ...defaultResponse };

  try {
    const responseUrssaf = await axios.post(urlUrssaf, [invoiceInfos], {
      headers,
    });

    if (responseUrssaf.status >= 200 && responseUrssaf.status < 300) {
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

  if (responseInfos.errorCode) {
    responseInfos.errorMessage = handleUrssafErrors(responseInfos);
  }

  return responseInfos;
};

const createInvoiceUrssaf = async (urssafToken, invoiceInfos, isTest) => {
  const urlUrssaf = getUrssafUrl(isTest);
  const invoiceUrl = urlUrssaf + "/demandePaiement";

  let response = { ...defaultResponse };

  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: "Bearer " + urssafToken,
  };

  try {
    const responseUrssaf = await manageInvoiceRequest(
      invoiceUrl,
      invoiceInfos,
      headers
    );

    response = { ...response, ...responseUrssaf };

    const invoiceStatus = await checkInvoiceStatusByNum(
      urssafToken,
      invoiceInfos.numFactureTiers,
      isTest
    );

    let isSameInvoice = true; // in case the invoice is created but no saved in AIS due to an urssaf errorr the submission of the invoices should check at least that it's the same client, same amount TTC

    if (responseUrssaf.errorCode === "ERR_FACTURE_DOUBLON") {
      isSameInvoice =
        invoiceStatus?.demandePaiement?.idClient === invoiceInfos?.idClient &&
        invoiceStatus?.demandePaiement?.mntFactureTTC ===
          invoiceInfos?.mntFactureTTC;
    }

    const invoiceCreated =
      (responseUrssaf?.idDemandePaiement || invoiceStatus?.success) &&
      isSameInvoice;

    if (!invoiceCreated) {
      return { ...responseUrssaf, success: false };
    }

    const { statut, infoVirement, infoRejet, commentaireRejet } =
      invoiceStatus || {};

    return {
      success: true,
      idFacture:
        responseUrssaf?.idDemandePaiement || invoiceStatus?.idDemandePaiement,
      errorCode: undefined,
      errorMessage: undefined,
      errorDescription: undefined,
      status: {
        statut,
        infoVirement,
        infoRejet,
        commentaireRejet,
      },
    };
  } catch (error) {
    response.errorCode = "INTERNE";
    response.errorDescription = error?.message || error;
  }

  return response;
};

module.exports = { createInvoiceUrssaf };
