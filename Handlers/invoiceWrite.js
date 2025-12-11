const {
  extractRequestContext,
} = require("../Helpers/General/extractRequestContext");
const { authUser } = require("../Helpers/Auth/authUser");
const { getUrssafToken } = require("../Helpers/Urssaf/getUrssafToken");
const createApiResponse = require("../Helpers/Responses/apiResponse");

const {
  checkInvoiceBody,
} = require("../Helpers/invoiceWriteHelpers/checkInvoiceBody");

const { parseRequestBody } = require("../Helpers/General/parseRequestBody");

const { MESSAGES } = require("../Helpers/Responses/messages");

const { logActivity } = require("../Helpers/General/logActivity");

/**
 * Helper to log activity and return API response
 **/

const logAndRespond = async (
  context,
  logData,
  userMessage,
  success = false,
  data = null
) => {
  await logActivity(context, "invoiceWrite", logData);
  return createApiResponse(success, data, userMessage);
};

/**
 * Main function to handle customer write requests
 **/

async function invoiceWrite(event) {
  let context = {};
  let clearedBody = {};
  const { headers, ip } = extractRequestContext(event);

  try {
    const authResponse = await authUser(headers);

    if (!authResponse.isAuthnenticated) {
      return authResponse.response;
    }

    context = { ip, professional: authResponse.userData.professional };

    /*     const { keyPublic, keyPrivate } = authResponse.userData?.urssaf; */

    const { body } = parseRequestBody(event, context, "invoiceWrite");

    const checkBodyResult = await checkInvoiceBody(body, context.professional);

    if (!checkBodyResult.isValid) {
      return await logAndRespond(
        context,
        {
          error: checkBodyResult.errorMessage,
          body,
          type: "checkError",
          userMessage: checkBodyResult.errorMessage,
        },
        checkBodyResult.errorMessage
      );
    }

    return createApiResponse(
      true,
      checkBodyResult.data,
      MESSAGES.INVOICE_VALIDATED
    );
  } catch (error) {
    console.log(error);
    return await logAndRespond(
      context,
      {
        body: clearedBody,
        error: error.message || error,
        userMessage: MESSAGES.INTERNAL_ERROR,
      },
      MESSAGES.INTERNAL_ERROR
    );
  }
}



module.exports = { invoiceWrite };
