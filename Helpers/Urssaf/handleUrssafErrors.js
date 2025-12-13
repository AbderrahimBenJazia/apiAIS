"use strict";
const { MESSAGES } = require("../Responses/messages");

const errorsDescription = {
  DENIED_URSSAF: MESSAGES.URSSAF_ACCESS_DENIED,
  INCONNUE: MESSAGES.INTERNAL_ERROR,
  NOT_AVAILABLE_URSSAF: MESSAGES.URSSAF_SERVICE_NOT_AVAILABLE,
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
  ERR_LIEN_PARTICULIER_PRESTATAIRE:
    "La date d'inscription du particulier à l'Avance Immédiate est postérieure à la date de la facture ou de la prestation.",
  ERR_DATE_FUTUR: "La date de début ou de fin de prestation est dans le futur.",
  ERR_CMPT_BLOQUE:
    "La facture n'a pas pu être créée car le compte du particulier a été bloqué par l'Urssaf suite à un prélèvement refusé pour sa précédente facture. Son compte sera débloqué sous maximum 4 semaines. Pour cette précédente facture l'Urssaf a versé au prestataire 100% du montant de la prestation, et va repréléver les 50% normalement dû par le particulier. Le particulier doit alors verser directement à l'organisme de SAP les 50% qui n'ont pas pu être prélevés.",
  ERR_FACTURE_DOUBLON:
    "La facture a déjà été déclarée à l'Avance Immédiate. Si vous souhaitez redéclarer cette prestation, veuillez indiquer un numéro de facturation différent.",
  ERR_PERIODE_EMPLOI_MOIS_NON_UNIQUE:
    "Les dates de début et de fin de prestation doivent être sur le même mois calendaire.",
  ERR_PARTICULIER_INCONNU:
    "Le particulier n'est pas inscrit à l'Avance Immédiate ou n'a pas encore validé son inscription.",
  ERR_MANDAT_ECHU:
    "Le mandat SEPA de votre client a expiré. Pour continuer à bénéficier de l’avance immédiate, il doit le renouveler depuis son espace Urssaf.",
  ERREUR_GARANTIE_FINANCIERE_NON_CONFORME:
    "Aucune garantie financière n'est associée à votre compte. La garantie financière est indispensable pour les sociétés dépassant les 200k€ de CA. Veuillez contacter les services de l'Urssaf pour plus d'informations.",
};
const handleUrssafErrors = (error) => {
  return (
    errorsDescription[error.errorCode] ||
    error.errorMessage ||
    errorsDescription["INCONNUE"]
  );
};

module.exports = { handleUrssafErrors };
