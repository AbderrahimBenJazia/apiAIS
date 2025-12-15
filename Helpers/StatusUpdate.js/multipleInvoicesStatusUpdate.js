"use strict";

const { arrangeArray } = require("../General/arrangeArrays");
const { connectToDatabase } = require("../Database/mongoConnexion");
const {
  getMultipleInvoiceStatus,
} = require("../Urssaf/getMultipleInvoiceStatus");

const URSAFF_LIMIT = 10;

const requestFunction = async (tokenUrssaf, chunk, isTest) => {
  const maxRetries = 3;
  let lastError = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const result = await getMultipleInvoiceStatus(tokenUrssaf, chunk, isTest);

      return result;
    } catch (error) {
      lastError = error;
      if (attempt < maxRetries) {
        await new Promise((resolve) =>
          setTimeout(resolve, Math.pow(2, attempt) * 100)
        );
      }
    }
  }

  return null;
};

const updateInvoiceInDb = async (professional, invoicesData) => {
  const client = await connectToDatabase();

  const db = client.db("providerDB");
  const collection = db.collection("bill");

  const updates = invoicesData.map((res) => {
    const {
      idDemandePaiement,
      numFactureTiers,
      mntVirement,
      dateVirement,
      statut,
      etat,
      codeRejet,
      commentaireRejet,
    } = res;

    const query = {
      professional,
      idFacture: idDemandePaiement,
    };

    const dataToUpdate = {
      numFactureTiers,
      mntVirement,
      dateVirement,
      statut,
      etat,
      codeRejet,
      commentaireRejet,
    };

    return collection.updateOne(query, { $set: dataToUpdate });
  });

  const updateResults = await Promise.allSettled(updates);

  return updateResults;
};

const multipleInvoicesStatusUpdate = async (
  invoiceNumbers,
  tokenUrssaf,
  professional,
  isTest
) => {
  const uniqueInvoiceNumbers = [...new Set(invoiceNumbers)];
  const chunks = arrangeArray(uniqueInvoiceNumbers, URSAFF_LIMIT);

  const requests = chunks.map((chunk) =>
    requestFunction(tokenUrssaf, chunk, isTest)
  );

  const response = await Promise.allSettled(requests);

  const allResults = response
    .filter((item) => item.status === "fulfilled" && item.value !== null)
    .flatMap((item) => item.value)
    .filter((r) => r.idDemandePaiement);

  if (allResults.length > 0) {
    await updateInvoiceInDb(professional, allResults);
  }
};

module.exports = { multipleInvoicesStatusUpdate };


