"use strict";

const { connectToDatabase } = require("./mongoConnexion");

const record = async (infos, collectionName) => {
  const client = await connectToDatabase();

  const db = client.db("awsApiRecord");

  const collection = db.collection(collectionName);

  await collection.insertOne({
    ...infos,
    date: new Date(),
  });
};

module.exports = record;
