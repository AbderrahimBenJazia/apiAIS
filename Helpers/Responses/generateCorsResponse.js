"use strict";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Requested-With",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Content-Type": "application/json",
};

const generateCors = () => {
  return {
    statusCode: 200,
    headers: corsHeaders,
    body: JSON.stringify({}), // Add empty body
  };
};

module.exports = generateCors;
