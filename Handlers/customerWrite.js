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

  return createApiResponse(true, urssafData, "URSSAF TOKEN RETRIEVED");
}

/* const main = async () => {
  const body = {
    civilite: "M",
    nomNaissance: "{Doe}",
    prenoms: "John",
    numeroTelephonePortable: "0612345678",
    adresseMail: "john.doe@example.com",
    libelleVoie: "10 rue de la paix",
    libelleCommuneResidence: "Paris ",
    codePostal: "75001",
    dateNaissance: "01-12-2022",
    codePaysNaissance: 99100,
    libelleCommuneNaissance: "Saint Denis",
    bic: "AGRIFRPPXXX",
    iban: "FR7630006000011234567890189",
    titulaire: "John Doe",
  };

  const event = {
    headers: {
      token: "AIS_4lhk8-IGSnZ-xI3dj-qNrDO-iBQ7J-eIBoD-LBj42-nOgbN-y2B2u-dw",
    },
    body: JSON.stringify(body),
  };
  const response = await customerWrite(event);

  console.log(response);
};
main(); */

module.exports = { customerWrite };
