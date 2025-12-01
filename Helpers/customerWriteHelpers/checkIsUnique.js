"use strict";

const { connectToDatabase } = require("../Database/mongoConnexion");

const checkIsUnique = async (adresseMail, cleExterneClient, professional) => {
  const client = await connectToDatabase();
  const db = client.db("providerDB");
  const collection = db.collection("customer");

  const searchArray = [{ adresseMail }];

  if (cleExterneClient) {
    searchArray.push({ cleExterneClient });
  }

  const query = {
    professional,
    $or: searchArray,
    status: { $ne: "inactive" },
  };

  const existingClient = await collection.findOne(query);

  if (existingClient) {
    return {
      isUnique: false,
      errorMessage:
        "[check] Un client avec cet email ou cette clé externe existe déjà.",
    };
  } else return { isUnique: true, errorMessage: null };
};

module.exports = { checkIsUnique };
