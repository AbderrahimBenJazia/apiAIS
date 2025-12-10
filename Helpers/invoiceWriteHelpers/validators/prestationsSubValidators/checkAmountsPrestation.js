"use strict";

const { roundNumber } = require("../../../General/roundNumber");

const TOLERANCE = 0.02;

const checkAmountsPrestation = (prestation, prestationNumber) => {
  const { mntUnitaireTTC, mntUnitaireHT, quantite, tauxTVA } = prestation;

  const check = Math.abs(mntUnitaireTTC - (1 + tauxTVA) * mntUnitaireHT) < TOLERANCE;

  if (!check) {
    return {
      isValid: false,
      errorMessage: `[Prestation ${prestationNumber}] Les montants unitaires HT et TTC ne sont pas cohérents avec le taux de TVA.`,
    };
  }

  const mntPrestationHT = roundNumber(mntUnitaireHT * quantite, 2);
  const mntPrestationTTC = roundNumber(mntUnitaireTTC * quantite, 2);

  return {
    isValid: true,
    value: { ...prestation, mntPrestationHT, mntPrestationTTC },
  };
};

module.exports = { checkAmountsPrestation };
