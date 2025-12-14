const getUrssafUrl = require("../Urssaf/getUrssafUrl");

const TIMEOUT_URSSAF = 10000;

const formatResponse = (response) => {
  // Adapt urssaf response to AIS format
  let formatedResponse = [];
  try {
    for (let i = 0; i < response?.length; i++) {
      const { idDemandePaiement, statut, infoVirement, infoRejet } = {
        ...response[i],
      };

      const data = {
        idDemandePaiement,
        mntVirement: infoVirement?.mntVirement,
        dateVirement: formatUrssafDate(infoVirement?.dateVirement) || "",
        statut: statut?.code,
        etat: statut?.libelle,
        codeRejet: infoRejet?.code,
        commentaireRejet: infoRejet?.commentaire,
      };

      formatedResponse.push(data);
    }

    return formatedResponse;
  } catch {
    return formatedResponse;
  }
};

const getInvoicesStatus = async (urssafToken, invoicesIds, isTest) => {
  // Get Invoice status (10 invoices at a time)

  const baseUrl = getUrssafUrl(isTest);

  const url = baseUrl + "/demandePaiement/rechercher";

  const searchParams = {
    idDemandePaiements: invoicesIds,
  };

  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: "Bearer " + urssafToken,
  };

  const response = await axios.post(url, searchParams, {
    headers,
    timeout: TIMEOUT_URSSAF,
  });

  return formatResponse(response.data.infoDemandePaiements);
};

module.exports = { getInvoicesStatus };
