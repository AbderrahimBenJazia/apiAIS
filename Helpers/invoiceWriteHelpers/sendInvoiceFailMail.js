"use strict";

const {sendMailAlert}= require("../General/sendMailAlert");


const sendInvoiceFailMail = async (professional, error, urssafResponse, body) => {
  try {
    const mail = {
      to: "avanceimmediate@gmail.com",
      subject: `[API Invoice Write FAIL - AWS] ${professional}`,
      html: `
        <div>
        <h3>Invoice Write Error</h3>
          <h3>Invoice Write Error</h3>
          <h4>Error:</h4>
          <pre>${JSON.stringify(error, null, 2)}</pre>
          <br/>
          <h4>URSSAF Response:</h4>
          <pre>${JSON.stringify(urssafResponse, null, 2)}</pre>
          <br/>
          <h4>Request Body:</h4>
          <pre>${JSON.stringify(body, null, 2)}</pre>
        </div>
      `,
      text: `Invoice Write Error - Professional: ${professional}`,
    };

    await sendMailAlert(mail);
  } catch (e) {
    // Silently fail - don't throw error for mail sending failure
    console.error("Failed to send invoice failure email:", e.message);
  }
};

module.exports = { sendInvoiceFailMail };
