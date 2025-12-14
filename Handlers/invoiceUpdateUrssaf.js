const {
  extractRequestContext,
} = require("../Helpers/General/extractRequestContext");

const { authUser } = require("../Helpers/Auth/authUser");

const { getUrssafToken } = require("../Helpers/Urssaf/getUrssafToken");

const createApiResponse = require("../Helpers/Responses/apiResponse");

const { parseRequestBody } = require("../Helpers/General/parseRequestBody");

const { MESSAGES } = require("../Helpers/Responses/messages");

const { logActivity } = require("../Helpers/General/logActivity");

const logAndRespond = async (
  context,
  logData,
  userMessage,
  success = false,
  data = null
) => {
  await logActivity(context, "invoiceUpdateUrssaf", logData);

  return createApiResponse(success, data, userMessage);
};

/**
 * Main function to handle customer write requests
 **/

async function invoiceUpdateUrssaf(event) {
  let context = {};
  let clearedBody = {};
  const { headers, ip } = extractRequestContext(event);

  try {
    const authResponse = await authUser(headers);

    if (!authResponse.isAuthnenticated) {
      return authResponse.response;
    }

    const professional = authResponse?.userData?.professional;

    context = { ip, professional };

    const { keyPublic, keyPrivate } = authResponse.userData?.urssaf;

    const { body } = parseRequestBody(event, context, "invoiceWrite");
  } catch (error) {
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
module.exports = { invoiceUpdateUrssaf };
