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

async function customerWrite(event) {
  let context = {};
  const { headers, ip } = extractRequestContext(event);

  const authResponse = await authUser(headers);

  if (!authResponse.isAuthnenticated) {
    return authResponse.response;
  }

  context = { ip, professional: authResponse.userData.professional };

  const { keyPublic, keyPrivate } = authResponse.userData?.urssaf;

  const isTest = authResponse.userData?.abonnement?.licence === "test";
  const tokenResponse = await getUrssafToken(keyPublic, keyPrivate, isTest);

  if (!tokenResponse.boolean) {
    return createApiResponse(false, null, "FAILED URSSAF AUTHENTICATION");
  }

  const { body } = parseRequestBody(event, context, "customerWrite");

  const checkBodyResult = await checkBody(body);

  if (!checkBodyResult.isValid) {
    return createApiResponse(false, null, checkBodyResult.errorMessage);
  }

  const urssafData = prepareUrssafData(checkBodyResult.data);

  const nTrials = urssafData.length;
  let response = null;

  for (let i = 0; i < nTrials; i++) {
    console.log("trial ", i + 1, " / ", nTrials);
    response = await createClientUrssaf(
      tokenResponse.token,
      urssafData[i],
      isTest
    );

    // If client creation succeeds, break out of loop
    if (response.success) {
      break;
    }
  }

  return createApiResponse(true, response, "CLIENT CREATION COMPLETED");
}

const main = async () => {
  const body = {
    civilite: "M",
    nomNaissance: "Espalivet",
    prenoms: "Kevin",
    numeroTelephonePortable: "0633055199",
    adresseMail: "kevin.espalivet@hotmail.fr",
    libelleVoie: "31 rue du troupeau",
    libelleCommuneResidence: "Argenteuil",
    codePostal: "95100",
    dateNaissance: "09-10-1991",
    codePaysNaissance: 99100,
    libelleCommuneNaissance: "Rodez",
    bic: "AGRIFRPPXXX",
    iban: "FR76300060000112345678901",
    titulaire: "Mr Kévin Espalivet",
  };

  const event = {
    headers: {
      token: "AIS_d0AVg-27vhn-jzWOl-0dFLU-8TE7B-LT7D7-ttjQH-L6rxU-9ZVBV-ba0Mk",
    },
    body: JSON.stringify(body),
  };
  const response = await customerWrite(event);

    console.log(response);
};
main();

module.exports = { customerWrite };
