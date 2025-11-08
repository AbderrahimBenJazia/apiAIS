"use strict";

const { connectToDatabase } = require("../Database/mongoConnexion");
const createApiResponse = require("../Responses/apiResponse");
const { MESSAGES } = require("../Responses/messages");
const { getHeaderValue } = require("../General/normalizeHeaders");
const {normalizeHeaders} = require("../General/normalizeHeaders");
const userProjections = {
  _id: 1,
  "api.token": 1,
  "api.tokenDate": 1,
  professional: 1,
  providerId: 1,
  information: 1,
  abonnement: 1,
  urssaf: 1,
};

const authUser = async (headers) => {
  headers = normalizeHeaders(headers);

  const token = getHeaderValue(headers.token);

  const infos = {
    isAuthnenticated: false,
    userData: null,
    response: createApiResponse(false, null, MESSAGES.UNAUTHORIZED_ACCESS),
  };

  if (!token || typeof token !== "string") {
    return infos;
  }

  const client = await connectToDatabase();
  const db = client.db("providerDB");
  const usersCollection = db.collection("professional");

  const user = await usersCollection.findOne(
    { "api.token": token },
    { projection: userProjections }
  );

  if (!user) {
    return infos;
  }

  const isTokenExpired = new Date() - user.api.tokenDate > 60 * 60 * 1000;

  if (isTokenExpired) {
    return {
      isAuthnenticated: false,
      userData: null,
      response: createApiResponse(false, null, MESSAGES.TOKEN_EXPIRED),
    };
  }

  infos.isAuthnenticated = true;
  infos.userData = user;
  infos.response = undefined;

  return infos;
};

module.exports = { authUser };

const main = async () => {
  const token = "AIS_v4zvi1dMmI0HnbPlj6NTgvEBbeJC3oR7j9yb58giyPz62e3PsH";
  const authInfo = await authUser(token);

  if (authInfo.isAuthnenticated) {
    console.log("User is authenticated:", authInfo.userData);
  } else {
    console.log("Authentication failed:", authInfo.response);
  }
};

main();
