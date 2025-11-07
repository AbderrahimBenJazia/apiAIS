"use strict";
const { MongoClient } = require("mongodb");
require("dotenv").config({ silent: true });

let cachedDb = null;
const uri = process.env.MONGO_URI;

async function connectToDatabase() {
  try {
    if (cachedDb) {
      return cachedDb;
    }

    if (!uri) {
      throw new Error("MONGO_URI environment variable is not defined");
    }

    const client = new MongoClient(uri, {
      maxPoolSize: 15,
      minPoolSize: 0,
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
      maxIdleTimeMS: 30000, // Close idle connections after 30s
      socketTimeoutMS: 20000, // Socket timeout
      // Performance optimizations
      readPreference: "primaryPreferred",
      retryWrites: true,
      retryReads: true,
      compressors: ["zlib"], // Network compression (removed zstd)
    });

    cachedDb = await client.connect();

    return cachedDb;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}

module.exports = { connectToDatabase };
