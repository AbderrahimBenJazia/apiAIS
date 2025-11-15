const {
  extractRequestContext,
} = require("../Helpers/General/extractRequestContext");
const { authUser } = require("../Helpers/Auth/authUser");
const { getUrssafToken } = require("../Helpers/Urssaf/getUrssafToken");
const createApiResponse = require("../Helpers/Responses/apiResponse");

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


  return createApiResponse(true, tokenResponse.token, "URSSAF TOKEN RETRIEVED");
}

const main = async () => {
  const event = {
    headers: {
      token: "AIS_5YxZK-AESKB-Tby5M-1fcoy-gXNbg-m0TnR-TVETP-YcSK5-aBffx-bA",
    },
  };

  const response = await customerWrite(event);
  console.log(response);
};

main();

module.exports = { customerWrite };
