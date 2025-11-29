"use strict";

const axios = require("axios");
const { getUrssafUrlToken } = require("./getUrssafUrl");

const CONFIG = {
  SCOPE: "homeplus.tiersprestations",
  GRANT_TYPE: "client_credentials",
};

const getUrssafToken = async (keyPublic, keyPrivate, isTest = false) => {
  try {
    // Input validation
    if (!keyPublic || !keyPrivate) {
      return {
        boolean: false,
        token: null,
        error:
          "Missing required parameters: keyPublic and keyPrivate are required",
      };
    }

    const url = getUrssafUrlToken(isTest);

  

    const body = new URLSearchParams({
      scope: CONFIG.SCOPE,
      grant_type: CONFIG.GRANT_TYPE,
      client_id: keyPublic,
      client_secret: keyPrivate,
    });

    const response = await axios.post(url, body, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    return {
      boolean: true,
      token: response.data.access_token,
      error: null,
    };
  } catch (error) {
    return {
      boolean: false,
      token: null,
      error: error?.message,
    };
  }
};

module.exports = {
  getUrssafToken,
};
