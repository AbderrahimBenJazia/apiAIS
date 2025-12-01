"use strict";

const { connectToDatabase } = require("../Database/mongoConnexion");


const saveClientToDb = async (data, maxRetries = 3, delayMs = 1000) => {
  let lastError = null;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const client = await connectToDatabase();
      const db = client.db("providerDB");
      const result = await db.collection("customer").insertOne(data);

      return { 
        success: true, 
        insertedId: result.insertedId, 
        error: null,
        attempts: attempt 
      };
    } catch (error) {
      lastError = error;
      
      // Don't retry on duplicate key errors (11000)
      if (error.code === 11000) {
        return { 
          success: false, 
          insertedId: null, 
          error: "Client already exists in database",
          attempts: attempt 
        };
      }
      
      // If not the last attempt, wait before retrying
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, delayMs * attempt));
      }
    }
  }

  // All retries exhausted
  return { 
    success: false, 
    insertedId: null, 
    error: `Database insertion failed after ${maxRetries} attempts: ${lastError.message}`,
    attempts: maxRetries 
  };
};

module.exports = { saveClientToDb };
