"use strict";
const MESSAGES = require("../Responses/messages");

const errorsDescription = {
  DENIED_URSSAF: MESSAGES.URSSAF_ACCESS_DENIED,
  INCONNUE: MESSAGES.INTERNAL_ERROR,
  MAINTENANCE:
    "Le serveur de l'URSSAF est sous maintenance, veuillez réessayer ultérieurement",
  ERR_CONTACT:
    "Veuillez vérifier le téléphone, le mail, l'adresse et les prénoms indiqués. Si le particulier a déjà été inscrit à l'Avance Immédiate par un autre prestataire, les informations indiquées doivent être identiques. Il pourra consulter ces informations sur son compte particulier Urssaf accessible sur https://www.particulier.urssaf.fr/#/identification",
  ERR_CONTACT_ADRESSE_COMMUNE: "La commune de résidence n'est pas reconnue.",
  ERR_DGFIP_R2P_INCONNU:
    "Les informations du particulier ne permettent pas de le reconnaître dans l'annuaire des impôts. Veuillez vérifier que les informations indiquées(nom, prénoms, date et lieu de naissance) correspondent bien à son avis d'imposition. Essayez également d'indiquer l'ensemble de ses prénoms, avec tiret ou espace.",
  ERR_DGFIP_IMPOTPART_INCONNU:
    "Le particulier ne peut pas avoir accès à l’avance immédiate de crédit d’impôt pour la période car aucune déclaration d'impôt n'est retrouvée dans la base de données des impôts. Généralement, cela correspond à une anomalie dans le dossier fiscal du client. Votre client devrait contacter son centre des impôts pour résoudre le problème.",
  ERR_COORDONNEES_BANCAIRES: "Le BIC ou l'IBAN est invalide.",
  ERREUR_TECHNIQUE:
    "Le service de l'Urssaf retourne une erreur technique, veuillez renouveler votre essai ultérieurement.",
  ERR_APPEL_BACB: "Le BIC ou l'IBAN est invalide.",
  ERR_ECV_PARTICULIERS_EXISTENT:
    "Plusieurs particuliers existent déjà avec l’état civil transmis. Votre client devrait prendre contact avec son centre des impôts pour qu'un audit soit réalisé sur son dossier.",
};
const handleUrssafErrors = (error) => {
  return (
    errorsDescription[error.errorCode] ||
    error.errorMessage ||
    errorsDescription["INCONNUE"]
  );
};

module.exports = { handleUrssafErrors };
