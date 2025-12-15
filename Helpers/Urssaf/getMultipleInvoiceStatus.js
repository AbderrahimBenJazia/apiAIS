const axios = require("axios");
const { getUrssafUrl } = require("./getUrssafUrl");
const { dateFormatMongo } = require("../formatters/dateFormatMongo");

const TIMEOUT_URSSAF = 10000;

const formatResponse = (response) => {
  // Adapt urssaf response to AIS format
  let formatedResponse = [];
  try {
    for (let i = 0; i < response?.length; i++) {
      const {
        idDemandePaiement,
        statut,
        infoVirement,
        infoRejet,
        demandePaiement,
      } = {
        ...response[i],
      };

      const data = {
        idDemandePaiement,
        mntVirement: infoVirement?.mntVirement,
        dateVirement: dateFormatMongo(infoVirement?.dateVirement) || "",
        statut: statut?.code,
        etat: statut?.libelle,
        codeRejet: infoRejet?.code || "",
        commentaireRejet: infoRejet?.commentaire || "",
        numFactureTiers: demandePaiement?.numFactureTiers,
      };

      formatedResponse.push(data);
    }

    return formatedResponse;
  } catch {
    return formatedResponse;
  }
};

const getMultipleInvoiceStatus = async (urssafToken, invoicesIds, isTest) => {
  // Get Invoice status (10 invoices at a time)

  const baseUrl = getUrssafUrl(isTest);

  const url = baseUrl + "/demandePaiement/rechercher";

  const searchParams = {
    numFactureTiers: invoicesIds,
  };

  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: "Bearer " + urssafToken,
  };

  try {
    const response = await axios.post(url, searchParams, {
      headers,
    });
    return formatResponse(response.data.infoDemandePaiements);
  } catch (error) {
    console.log(error);
  }
};

module.exports = { getMultipleInvoiceStatus };
