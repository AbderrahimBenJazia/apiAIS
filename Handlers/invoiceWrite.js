const {
  authenticateAndGetToken,
} = require("../Helpers/Auth/authenticateAndGetToken");
const { logAndRespond } = require("../Helpers/Responses/logAndRespond");
const {
  handleValidationError,
} = require("../Helpers/Responses/handleValidationError");

const {
  checkInvoiceBody,
} = require("../Helpers/invoiceWriteHelpers/checkInvoiceBody");

const { MESSAGES } = require("../Helpers/Responses/messages");
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
 * Main function to handle invoice write requests
 **/

async function invoiceWrite(event) {
  let clearedBody = {};

  try {
    // Authenticate and get URSSAF token
    const authResult = await authenticateAndGetToken(event, "invoiceWrite");

    if (authResult.failed) return authResult.response;

    const {
      context,
      body,
      authResponse,
      tokenResponse,
      isTest,
      professional,
    } = authResult;

    // Check invoice body
    const checkBodyResult = await checkInvoiceBody(body, professional);
    if (!checkBodyResult.isValid) {
      return await handleValidationError(
        "invoiceWrite",
        context,
        "checkError",
        checkBodyResult.errorMessage,
        { body, numFactureTiers: body.numFactureTiers }
      );
    }

    const { client, validatedData } = checkBodyResult.data;
    const numFactureTiers = validatedData.numFactureTiers;

    clearedBody = validatedData;

    const checkNumber = await checkIfNumberExists(
      professional,
      numFactureTiers
    );

    if (!checkNumber.isValid) {
      return await handleValidationError(
        "invoiceWrite",
        context,
        "checkError",
        checkNumber.errorMessage,
        { body, numFactureTiers }
      );
    }

    // Check URSSAF token
    if (!tokenResponse.boolean) {
      return await handleValidationError(
        "invoiceWrite",
        context,
        "tokenError",
        MESSAGES.URSSAF_ACCESS_DENIED,
        { numFactureTiers }
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

      return await handleValidationError(
        "invoiceWrite",
        context,
        "urssafError",
        responseUrssaf.errorMessage,
        {
          body: clearedBody,
          numFactureTiers,
          ...responseUrssaf,
        }
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
      return await handleValidationError(
        "invoiceWrite",
        context,
        "dbError",
        MESSAGES.INTERNAL_ERROR,
        {
          body: clearedBody,
          error: responseDb.error,
          attempts: responseDb.attempts,
          idFacture: responseUrssaf.idFacture,
          numFactureTiers,
        }
      );
    }

    return await logAndRespond(
      "invoiceWrite",
      context,
      {
        body: clearedBody,
        error: null,
        insertedId: responseDb.insertedId,
        idFacture: responseUrssaf.idFacture,
        numFactureTiers,
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

    return await handleValidationError(
      "invoiceWrite",
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

const main = async () => {
  const headers = {
    token: "AIS_vtuhD-T5ybq-Q2M8U-tkjnn-2LauM-WZNoe-hn3VF-YRUXF-saw0M-ufWE",
  };

  const prestation1 = {
    codeNature: 90,
    unite: "FORFAIT",
    quantite: 1,
    tauxTVA: 0.02,
    mntUnitaireTTC: "448",
    nomActivite: "Garde d'enfant + 6 ans",
    mntUnitaireHT: 439.2156862745098,
  };

  /*   const prestation2 = {
    codeNature: 90,
    unite: "FORFAIT",
    quantite: 1,
    tauxTVA: 0.1,
    mntUnitaireTTC: "33.13",
    nomActivite: "Garde d'enfant + 6 ans",
    mntUnitaireHT: 30.118181818181817,
  }; */

  const body = {
    adresseMail: "benjazia.abou@gmail.com",
    numFactureTiers: "test_131310121",

    dateFacture: "17/11/2025",

    dateDebutEmploi: "30/11/2025",

    dateFinEmploi: "30/11/2025",

    mntFactureTTC: "448",

    prestationListe: [prestation1 /* , prestation2 */],
  };

  const event = { body: JSON.stringify(body), headers };

  const response = await invoiceWrite(event);

  console.log(response);
};

main();
module.exports = { invoiceWrite };
