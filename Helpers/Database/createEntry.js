"use strict";

const { connectToDatabase } = require("./mongoConnexion");

const createEntry = async (
  data,
  dbName,
  collectionName,
  maxRetries = 3,
  delayMs = 1000
) => {
  let lastError = null;


  const   duplicateErrorMessage = `Duplicate key error: ${collectionName} already exists in the database.`;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const client = await connectToDatabase();
      const db = client.db(dbName);
      const result = await db.collection(collectionName).insertOne(data);

      return {
        success: true,
        insertedId: result.insertedId,
        error: null,
        attempts: attempt,
      };
    } catch (error) {
      lastError = error;

      // Don't retry on duplicate key errors (11000)
      if (error.code === 11000) {
        return {
          success: false,
          insertedId: null,
          error: duplicateErrorMessage,
          attempts: attempt,
        };
      }

      // If not the last attempt, wait before retrying
      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, delayMs * attempt));
      }
    }
  }

  // All retries exhausted
  return {
    success: false,
    insertedId: null,
    error: `Database insertion failed after ${maxRetries} attempts: ${lastError.message}`,
    attempts: maxRetries,
  };
};

module.exports = { createEntry };
