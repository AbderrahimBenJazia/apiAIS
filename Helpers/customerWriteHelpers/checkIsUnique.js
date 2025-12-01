"use strict";

const { connectToDatabase } = require("../Database/mongoConnexion");

const checkIsUnique = async (email, cleExterneClient, professional) => {
  const client = await connectToDatabase();
  const db = client.db("providerDB");
  const collection = db.collection("customer");

  const query = {
    professional,
    $or: [{ cleExterneClient }, { adresseMail: email }],
  };

  const existingClient = await collection.findOne(query);

  if (existingClient) {
    return {
      isUnique: false,
      errorMessage:
        "Un client avec cet email ou cette clé externe existe déjà.",
    };
  } else return { isUnique: true, errorMessage: null };
};

module.exports = { checkIsUnique };
