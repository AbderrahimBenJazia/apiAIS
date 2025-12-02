"use strict";

const formatClientAddress = (customerData) => {
  if (!customerData || typeof customerData !== "object") {
    return "";
  }

  const adresseList = [
    "adressePostaleVoieNumero",
    "adressePostaleVoieLettre",
    "adressePostaleVoieCode",
    "adressePostaleVoieLibelle",
    "adressePostaleComplement",
    "adressePostaleLieuDit",
    "adressePostaleCodePostal",
    "adressePostaleCommuneLibelle",
  ];

  const addressParts = [];

  for (const key of adresseList) {
    const value = customerData[key];
    if (value !== undefined && value !== null && value !== "") {
      addressParts.push(String(value));
    }
  }

  // Join parts with space and normalize multiple spaces
  return addressParts
    .join(" ")
    .replace(/\s{2,}/g, " ")
    .trim();
};

module.exports = { formatClientAddress };
