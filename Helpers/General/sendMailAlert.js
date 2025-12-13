"use strict";

const axios = require("axios");
require("dotenv").config({ silent: false });

const sendMailAlert = async (mail) => {
  const url = "https://api.mailjet.com/v3.1/send";
  const header = {
    "Content-Type": "application/json",
  };
  const auth = {
    username: process.env.MAILJET_USERNAME,
    password: process.env.MAILJET_PWD,
  };

  // Build message
  const message = {
    From: {
      Email: "contact@avanceimmediate.com",
      Name: "Avance Immédiate Services",
    },
    To: [{ Email: mail.to }],
    Subject: mail.subject,
    TextPart: mail.text,
    HTMLPart: mail.html,
  };

  const data = { Messages: [message] };

  // Send request
  try {
    const response = await axios({
      url: url,
      method: "post",
      headers: header,
      auth: auth,
      data: data,
    });

    return response.data;
  } catch (error) {
    throw new Error(`MailJet error: ${error.message}`);
  }
};

module.exports = { sendMailAlert };
