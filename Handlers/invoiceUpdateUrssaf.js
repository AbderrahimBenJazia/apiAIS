const {
  authenticateAndGetToken,
} = require("../Helpers/Auth/authenticateAndGetToken");
const { logAndRespond } = require("../Helpers/Responses/logAndRespond");
const {
  handleValidationError,
} = require("../Helpers/Responses/handleValidationError");

const { MESSAGES } = require("../Helpers/Responses/messages");

async function invoiceUpdateUrssaf(event) {
  let clearedBody = {};
  let context = null;
  let professional = null;

  try {
    // Authenticate and get URSSAF token
    const authResult = await authenticateAndGetToken(
      event,
      "invoiceUpdateUrssaf"
    );

    if (authResult.failed) return authResult.response;

    const { body, authResponse, tokenResponse, isTest } = authResult;
    context = authResult.context;
    professional = authResult.professional;














    
  } catch (error) {
    return await handleValidationError(
      "invoiceUpdateUrssaf",
      context,
      "internalError",
      MESSAGES.INTERNAL_ERROR,
      {
        body: clearedBody,
        error: error.message || error,
      }
    );
  }
}

module.exports = { invoiceUpdateUrssaf };
