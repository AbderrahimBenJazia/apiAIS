"use strict";

const { connectToDatabase } = require("../Database/mongoConnexion");

const errorMessage =
  "[check] Une facture avec ce numéro existe déjà dans votre compte AIS.";

const checkIfNumberExists = async (professional, numberToCheck) => {
  const client = await connectToDatabase();
  const db = client.db("providerDB");
  const collectionAi = db.collection("bill");
  const collectionNonAi = db.collection("billNonAi");

  const query = { professional, numFactureTiers: numberToCheck };

  const existingInAi = await collectionAi.findOne(query);
  if (existingInAi) {
    return { isValid: false, errorMessage };
  }
  const existingInNonAi = await collectionNonAi.findOne(query);

  if (existingInNonAi) {
    return { isValid: false, errorMessage };
  }

  return { isValid: true, errorMessage: null };
};

module.exports = { checkIfNumberExists };
