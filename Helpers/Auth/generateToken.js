"use strict";
const crypto = require("crypto");

const generateToken = (prefix, length) => {
  const randomBytes = crypto.randomBytes(Math.ceil(length * 0.75));
  let token = randomBytes
    .toString("base64")
    .replace(/[+/=]/g, "")
    .substring(0, length);

  token = token.match(/.{1,5}/g).join("-");

  token = prefix + token;
  return token;
};


module.exports = generateToken;