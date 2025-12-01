const {
  extractRequestContext,
} = require("../Helpers/General/extractRequestContext");
const { authUser } = require("../Helpers/Auth/authUser");
const { getUrssafToken } = require("../Helpers/Urssaf/getUrssafToken");
const createApiResponse = require("../Helpers/Responses/apiResponse");
const { checkBody } = require("../Helpers/customerWriteHelpers/checkBody");
const { parseRequestBody } = require("../Helpers/General/parseRequestBody");
const {
  prepareUrssafData,
} = require("../Helpers/customerWriteHelpers/prepareUrssafData");

const { createClientUrssaf } = require("../Helpers/Urssaf/createClientUrssaf");
const {
  saveClientToDb,
} = require("../Helpers/customerWriteHelpers/saveClientToDb");
const { handleUrssafErrors } = require("../Helpers/Urssaf/handleUrssafErrors");

const { MESSAGES } = require("../Helpers/Responses/messages");
const {
  prepareDbData,
} = require("../Helpers/customerWriteHelpers/prepareDbData");
const { logActivity } = require("../Helpers/General/logActivity");

const {
  checkIsUnique,
} = require("../Helpers/customerWriteHelpers/checkIsUnique");

/**
 * Helper to log activity and return API response
 **/

const logAndRespond = async (
  context,
  logData,
  userMessage,
  success = false
) => {
  await logActivity(context, "customerWrite", logData);
  return createApiResponse(success, null, userMessage);
};

/**
 * Main function to handle customer write requests
 **/

async function customerWrite(event) {
  let context = {};
  let clearedBody = {};
  const { headers, ip } = extractRequestContext(event);

  try {
    const authResponse = await authUser(headers);

    if (!authResponse.isAuthnenticated) {
      return authResponse.response;
    }

    context = { ip, professional: authResponse.userData.professional };

    const { keyPublic, keyPrivate } = authResponse.userData?.urssaf;

    const isTest = authResponse.userData?.abonnement?.licence === "test";
    const tokenResponse = await getUrssafToken(keyPublic, keyPrivate, isTest);

    if (!tokenResponse.boolean) {
      return await logAndRespond(
        context,
        {
          error: "Urssaf token retrieval failed",
          type: "tokenError",
          userMessage: MESSAGES.URSSAF_ACCESS_DENIED,
        },
        MESSAGES.URSSAF_ACCESS_DENIED
      );
    }

    const { body } = parseRequestBody(event, context, "customerWrite");

    // Create cleared body for logging (remove sensitive banking info)
    clearedBody = { ...body };
    delete clearedBody.iban;
    delete clearedBody.bic;
    delete clearedBody.titulaire;

    const checkBodyResult = await checkBody(body);

    if (!checkBodyResult.isValid) {
      return await logAndRespond(
        context,
        {
          error: checkBodyResult.errorMessage,
          body: clearedBody,
          type: "checkError",
          userMessage: checkBodyResult.errorMessage,
        },
        checkBodyResult.errorMessage
      );
    }

    // check if user exists in DB (mail and or cleExterneClient)

    const isUniqueResult = await checkIsUnique(
      checkBodyResult.data.adresseMail,
      checkBodyResult.data.cleExterneClient,
      context.professional
    );

    if (!isUniqueResult.isUnique) {
      return await logAndRespond(
        context,
        {
          error: isUniqueResult.errorMessage,
          body: clearedBody,
          type: "clientExistsError",
          userMessage: isUniqueResult.errorMessage,
        },
        isUniqueResult.errorMessage
      );
    }

    const urssafData = prepareUrssafData(checkBodyResult.data);

    const nTrials = urssafData.length;
    let responseUrssaf = null;

    let acceptedData = null;

    for (let i = 0; i < nTrials; i++) {
      responseUrssaf = await createClientUrssaf(
        tokenResponse.token,
        urssafData[i],
        isTest
      );

      // If client creation succeeds, break out of loop
      if (responseUrssaf.success) {
        acceptedData = {
          ...urssafData[i],
          urssafKeyCustomer: responseUrssaf.urssafKeyCustomer,
          statusUrssaf: responseUrssaf.status,
          cleExterneClient: checkBodyResult.data.cleExterneClient,
          prenoms: body.prenoms,
          nomNaissance: body.nomNaissance,
          nomUsage: body.nomUsage || body.nomNaissance,
        };

        break;
      }
    }

    if (!responseUrssaf.success) {
      const errorMessage = handleUrssafErrors(responseUrssaf);

      return await logAndRespond(
        context,
        {
          body: clearedBody,
          error: errorMessage,
          ...responseUrssaf,
          type: "urssafError",
          userMessage: errorMessage,
        },
        errorMessage
      );
    }

    const dbData = prepareDbData(acceptedData, authResponse.userData);

    const responseDb = await saveClientToDb(dbData);

    if (!responseDb.success) {
      return await logAndRespond(
        context,
        {
          body: clearedBody,
          error: responseDb.error,
          attempts: responseDb.attempts,
          urssafKeyCustomer: acceptedData.urssafKeyCustomer,
          type: "dbError",
          userMessage: MESSAGES.INTERNAL_ERROR,
        },
        MESSAGES.INTERNAL_ERROR
      );
    }

    return await logAndRespond(
      context,
      {
        body: clearedBody,
        error: null,
        insertedId: responseDb.insertedId,
        urssafKeyCustomer: acceptedData.urssafKeyCustomer,
        attempts: responseDb.attempts,
        type: "success",
        userMessage: MESSAGES.CUSTOMER_CREATED_SUCCESS,
      },
      MESSAGES.CUSTOMER_CREATED_SUCCESS,
      true
    );
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

module.exports = { customerWrite };
