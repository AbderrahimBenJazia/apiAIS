"use strict";

/**
 * Centralized error messages configuration
 * This file contains all error messages used throughout the application
 */

const MESSAGES = {
  // Authentication errors
  NO_KEYS_PROVIDED:
    "[tokenAIS] Le header doit contenir keyPublic et keyPrivate",
  INVALID_CREDENTIALS:
    "[tokenAIS] Le couple de clés indiqué ne correpond à aucun utilisateur AIS.",
  SUCCESSFUL_AUTHENTICATION: "Connexion réussie.",
  // General errors
  INTERNAL_ERROR: "Erreur interne du serveur",
  UNAUTHORIZED_ACCESS: "Accès non autorisé",
  TOKEN_EXPIRED: "Le token utilisé est invalide.",
  INVALID_BODY :"Invalid JSON in request body",
  // URSSAF errors
  URSSAF_ACCESS_DENIED: "L'accès à l'API Tiers de prestation est refusé, veuillez réessayer ultèrieurement",
  // Success messages
  CUSTOMER_CREATED_SUCCESS: "Particulier inscrit à l'Avance Immédiate avec succès."
};

module.exports = {
  MESSAGES,
};
