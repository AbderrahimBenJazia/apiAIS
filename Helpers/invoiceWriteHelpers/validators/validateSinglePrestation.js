"use strict";

const { findDictValue } = require("../../General/findDictValue");

const ALLOWED_FIELDS = [
  "codeNature",
  "activity",
  "activite",
  "activité",
  "type",
  "nature",
  "unité",
  "unite",
  "unity",
  "nombre",
  "quantite",
  "qte",
  "nombre",
  "nb",
  "mntUnitaireHT",
  "mntUnitaireht",
  "montantHT",
  "prixHT",
  "mntUnitaireTTC",
  "mntUnitairettc",
  "montantTTC",
  "prixTTC",
  "tauxTVA",
  "tva",
  "TVA",
  "commentaire",
  "complement1",
  "complement2",
  "intervenant",
];

const validateSinglePrestation = (prestation, counter) => {
  const cleanPrestation = extractBodyValidFields(prestation, ALLOWED_FIELDS);
};
