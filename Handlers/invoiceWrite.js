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
const {
  prepareUrssafData,
} = require("../Helpers/invoiceWriteHelpers/prepareUrssafData");

const {
  createInvoiceUrssaf,
} = require("../Helpers/Urssaf/createInvoiceUrssaf");
const {
  checkIfNumberExists,
} = require("../Helpers/invoiceWriteHelpers/checkIfNumberExists");

const {
  prepareDbData,
} = require("../Helpers/invoiceWriteHelpers/prepareDbData");

const { createEntry } = require("../Helpers/Database/createEntry");

const {
  sendInvoiceFailMail,
} = require("../Helpers/invoiceWriteHelpers/sendInvoiceFailMail");
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

    const professional = authResponse?.userData?.professional;

    context = { ip, professional };

    const { keyPublic, keyPrivate } = authResponse.userData?.urssaf;

    const { body } = parseRequestBody(event, context, "invoiceWrite");

    const checkBodyResult = await checkInvoiceBody(body, professional);
    if (!checkBodyResult.isValid) {
      return await logAndRespond(
        context,
        {
          error: checkBodyResult.errorMessage,
          body,
          type: "checkError",
          userMessage: checkBodyResult.errorMessage,
          numFactureTiers: body.numFactureTiers,
        },
        checkBodyResult.errorMessage
      );
    }

    const { client, validatedData } = checkBodyResult.data;

    clearedBody = validatedData;

    const checkNumber = await checkIfNumberExists(
      professional,
      validatedData.numFactureTiers
    );

    if (!checkNumber.isValid) {
      return await logAndRespond(
        context,
        {
          error: checkNumber.errorMessage,
          body,
          type: "checkError",
          userMessage: checkNumber.errorMessage,
          numFactureTiers: validatedData.numFactureTiers,
        },
        checkNumber.errorMessage
      );
    }

    const isTest = authResponse.userData?.abonnement?.licence === "test";
    const tokenResponse = await getUrssafToken(keyPublic, keyPrivate, isTest);

    if (!tokenResponse.boolean) {
      return await logAndRespond(
        context,
        {
          error: "Urssaf token retrieval failed",
          type: "tokenError",
          userMessage: MESSAGES.URSSAF_ACCESS_DENIED,
          numFactureTiers: validatedData.numFactureTiers,
        },
        MESSAGES.URSSAF_ACCESS_DENIED
      );
    }

    const dataUrssaf = prepareUrssafData(
      authResponse?.userData,
      client,
      validatedData
    );

    const responseUrssaf = await createInvoiceUrssaf(
      tokenResponse.token,
      dataUrssaf,
      isTest
    );

    if (!responseUrssaf.success) {
      await sendInvoiceFailMail(
        professional,
        responseUrssaf.errorMessage,
        responseUrssaf,
        clearedBody
      );

      return await logAndRespond(
        context,
        {
          body: clearedBody,
          ...responseUrssaf,
          type: "urssafError",
          numFactureTiers: validatedData.numFactureTiers,
          userMessage: responseUrssaf.errorMessage,
        },
        responseUrssaf.errorMessage
      );
    }

    const dbData = prepareDbData(
      authResponse.userData,
      client,
      validatedData,
      responseUrssaf
    );

    const responseDb = await createEntry(dbData, "providerDB", "bill");

    if (!responseDb.success) {
      return await logAndRespond(
        context,
        {
          body: clearedBody,
          error: responseDb.error,
          attempts: responseDb.attempts,
          idFacture: responseUrssaf.idFacture,
          numFactureTiers: validatedData.numFactureTiers,
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
        idFacture: responseUrssaf.idFacture,
        numFactureTiers: validatedData.numFactureTiers,
        attempts: responseDb.attempts,
        type: "success",
        userMessage: MESSAGES.INVOICE_CREATED_SUCCESS,
      },
      MESSAGES.INVOICE_CREATED_SUCCESS,
      true,
      clearedBody
    );
  } catch (error) {
    await sendInvoiceFailMail(
      context?.professional,
      error?.message || error,
      null,
      JSON.parse(event.body)
    );

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

const main = async () => {
  const headers = {
    token: "AIS_cSUCs-Z43mY-AQub7-4dpcV-gNbFz-VtTEc-FkbCi-6qI6i-vX5pp-wYTmc",
  };

  const prestation1 = {
    codeNature: "100",
    quantite: "2",
    unite: "heure",
    tauxTVA: "20%",
    mntUnitaireHT: "50",
    commentaire: "Prestation de test",
  };

  const prestation2 = {
    codeNature: "Ménage-repassage",
    quantite: "1",
    unite: "heure",
    tauxTVA: "20%",
    mntUnitaireHT: "50",
    commentaire: "Prestation de test",
  };

  const body = {
    adresseMail: "benjazia.abou@gmail.com",
    numFactureTiers: 1,
    dateFacture: "2025-12-03",
    /*     dateDEbutEmploi: "2027-12-01",
    dateFinEmploi: "2027-12-02", */
    acompte: "10.00131",
    prestationListe: [prestation1, prestation2],
    mntFactureHT: 150,
    mntFactureTTC: 180,
  };

  const event = { body: JSON.stringify(body), headers };

  const response = await invoiceWrite(event);

  console.log(response);
};

main();
module.exports = { invoiceWrite };
