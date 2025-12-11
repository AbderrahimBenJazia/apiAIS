"use strict";

const { connectToDatabase } = require("../Database/mongoConnexion");
const { findDictValue } = require("../General/findDictValue");

// Helper function to search and validate
const searchCustomer = async (collection, professional, mode, value) => {
  // Validate input
  if (!value || typeof value !== "string") {
    return {
      found: false,
      client: null,
      errorMessage: `[${mode}] Valeur invalide ou vide fournie pour la recherche`,
    };
  }

  const baseQuery = {
    professional,
    status: null,
  };

  // Configure search based on mode
  const searchConfig = {
    cleExterne: {
      field: "cleExterneClient",
      normalizedValue: value.toLowerCase().replace(/\s+/g, ""),
      fieldLabel: "cleExterneClient",
    },
    mail: {
      field: "adresseMail",
      normalizedValue: value,
      fieldLabel: "adresseMail",
    },
  };

  const config = searchConfig[mode];


  
  if (!config) {
    throw new Error(`Mode invalide: ${mode}. Utilisez "cleExterne" ou "mail".`);
  }

  const customers = await collection
    .find({
      ...baseQuery,
      [config.field]: { $regex: config.normalizedValue, $options: "i" },
    })
    .toArray();


  if (customers.length === 0) {
    return {
      found: false,
      client: null,
      errorMessage: `l'${config.fieldLabel} ne permet pas de retrouver votre client. Veuillez vérifier que ce dernier est bien inscrit avec cette ${config.fieldLabel}.`,
    };
  }

  if (customers.length > 1) {
    return {
      found: false,
      client: null,
      errorMessage: `Plusieurs clients sont rattachés à la clé indiquée.`,
    };
  }

  return {
    found: true,
    client: customers[0],
    errorMessage: null,
  };
};

const checkCustomer = async (professional, body) => {
  const client = await connectToDatabase();
  const db = client.db("providerDB");
  const customerCollection = db.collection("customer");

  // Stage 1: Try external key (cleExterneClient)
  const [cleExterneClient, cleKey] = findDictValue(
    ["cleExterneClient", "cleexterneclient"],
    body,
    false
  );

  if (cleExterneClient) {
    return await searchCustomer(
      customerCollection,
      professional,
      "cleExterne",
      body[cleKey]
    );
  }

  // Stage 2: Try email address
  const [adresseMail, mailKey] = findDictValue(
    ["adresseMail", "adressMail", "mailAdress", "mail", "Mail"],
    body,
    false
  );

  if (!adresseMail) {
    return {
      found: false,
      client: null,
      errorMessage:
        "Aucune clé externe ou adresse mail n'a été fournie pour identifier le client",
    };
  }

  const result = await searchCustomer(
    customerCollection,
    professional,
    "mail",
    body[mailKey]
  );

  return result;
};

module.exports = { checkCustomer };
