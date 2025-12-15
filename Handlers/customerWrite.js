const {
  authenticateAndGetToken,
} = require("../Helpers/Auth/authenticateAndGetToken");
const { logAndRespond } = require("../Helpers/Responses/logAndRespond");
const {
  handleValidationError,
} = require("../Helpers/Responses/handleValidationError");
const { logActivity } = require("../Helpers/General/logActivity");

const {
  checkCustomerBody,
} = require("../Helpers/customerWriteHelpers/checkCustomerBody");
const {
  prepareUrssafData,
} = require("../Helpers/customerWriteHelpers/prepareUrssafData");

const { createClientUrssaf } = require("../Helpers/Urssaf/createClientUrssaf");
const { createEntry } = require("../Helpers/Database/createEntry");

const { MESSAGES } = require("../Helpers/Responses/messages");
const {
  prepareDbData,
} = require("../Helpers/customerWriteHelpers/prepareDbData");

const {
  checkIsUnique,
} = require("../Helpers/customerWriteHelpers/checkIsUnique");

const {
  countriesList,
} = require("../Helpers/customerWriteHelpers/communes/getCountryCode");

/**
 * Main function to handle customer write requests
 **/

async function customerWrite(event) {
  let clearedBody = {};
  let context = null;

  try {
    // Authenticate and get URSSAF token
    const authResult = await authenticateAndGetToken(event, "customerWrite");
    if (authResult.failed) return authResult.response;

    const { body, authResponse, tokenResponse, isTest } = authResult;
    context = authResult.context;

    // Handle countries info request
    const info = body.info;
    if (["pays", "true", true].includes(info)) {
      await logActivity(context, "customerWrite", {
        error: null,
        type: "infoPays",
      });
      return countriesList;
    }

    // Create cleared body for logging (remove sensitive banking info)
    clearedBody = { ...body };
    delete clearedBody.iban;
    delete clearedBody.bic;
    delete clearedBody.titulaire;

    const checkBodyResult = await checkCustomerBody(body);

    if (!checkBodyResult.isValid) {
      return await handleValidationError(
        "customerWrite",
        context,
        "checkError",
        checkBodyResult.errorMessage,
        { body: clearedBody }
      );
    }

    // check if user exists in DB (mail and or cleExterneClient)

    const isUniqueResult = await checkIsUnique(
      checkBodyResult.data.adresseMail,
      checkBodyResult.data.cleExterneClient,
      context.professional
    );

    if (!isUniqueResult.isUnique) {
      return await handleValidationError(
        "customerWrite",
        context,
        "clientExistsError",
        isUniqueResult.errorMessage,
        { body: clearedBody }
      );
    }

    // Check URSSAF token
    if (!tokenResponse.boolean) {
      return await handleValidationError(
        "customerWrite",
        context,
        "tokenError",
        MESSAGES.URSSAF_ACCESS_DENIED
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
      return await handleValidationError(
        "customerWrite",
        context,
        "urssafError",
        responseUrssaf.errorMessage,
        {
          body: clearedBody,
          ...responseUrssaf,
        }
      );
    }

    const dbData = prepareDbData(acceptedData, authResponse.userData);

    const responseDb = await createEntry(dbData, "providerDB", "customer");

    if (!responseDb.success) {
      return await handleValidationError(
        "customerWrite",
        context,
        "dbError",
        MESSAGES.INTERNAL_ERROR,
        {
          body: clearedBody,
          error: responseDb.error,
          attempts: responseDb.attempts,
          numeroClient: responseUrssaf.numeroClient,
        }
      );
    }

    return await logAndRespond(
      "customerWrite",
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
    return await handleValidationError(
      "customerWrite",
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

module.exports = { customerWrite };

const main = async () => {
  const headers = {
    token: "AIS_vtuhD-T5ybq-Q2M8U-tkjnn-2LauM-WZNoe-hn3VF-YRUXF-saw0M-ufWE",
  };

  const body = {
    civilite: "1",
    nomNaissance: "BENdadaZIA",
    nomUsage: "Ben ",
    prenoms: "Erir",
    numeroTelephonePortable: "0683168950",
    adresseMail: "benjxxe@gmail.com",
    libelleVoie: "15 rues des pommes",
    libelleCommuneResidence: "Nice",
    codePostal: "06000",
    dateNaissance: "15/09/2000",
    codePaysNaissance: 99351,
    bic: "AGRIFRPPXXX",
    iban: "FR76 3000 6000 0112 3456 7890 189",
  };

  const event = { body: JSON.stringify(body), headers };

  const response = await customerWrite(event);
  console.log(response);
};
main();
