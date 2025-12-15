const { findDictValue } = require("../General/findDictValue");
const { connectToDatabase } = require("../Database/mongoConnexion");
const { dateFormatMongo } = require("../formatters/dateFormatMongo");

// Field name constants
const INVOICE_LIST_KEYS = [
  "numFactureTiersListe",
  "factures",
  "factureList",
  "factureListe",
];
const DATE_DEBUT_KEYS = ["dateDebut", "debut"];
const DATE_FIN_KEYS = ["dateFin", "fin"];

// Format date as dd-mm-yyyy
const formatDateString = (date) => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

// Generate all dates between start and end as dd-mm-yyyy strings
const generateDateRange = (startDate, endDate) => {
  const dateStrings = [];
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    dateStrings.push(formatDateString(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dateStrings;
};

const getInvoices = async (professional, body) => {
  try {
    const client = await connectToDatabase();
    const db = client.db("providerDB");
    const collection = db.collection("bill");

    // Mode 1: Update by invoice number list
    const [numFactureTiersListe] = findDictValue(INVOICE_LIST_KEYS, body);

    if (numFactureTiersListe) {
      // Validate array
      if (!Array.isArray(numFactureTiersListe)) {
        return {
          isValid: false,
          errorMessage:
            "La valeur de numFactureTiersListe doit être un tableau.",
        };
      }

      // Query by invoice numbers
      const filter = {
        professional,
        numFactureTiers: { $in: numFactureTiersListe },
      };

      const invoices = await collection.find(filter).toArray();

      const invoiceMap = new Map(
        invoices.map((inv) => [inv.numFactureTiers, inv])
      );

      // Format results: mark each invoice as found or not found
      const data = numFactureTiersListe.map((numFactureTiers) => {
        const invoice = invoiceMap.get(numFactureTiers);

        if (invoice) {
          return {
            boolean: true,
            numFactureTiers,
            idFacture: invoice.idFacture,
          };
        } else {
          return {
            boolean: false,
            numFactureTiers,
            message: "Demande de paiement non trouvée.",
          };
        }
      });

      return { isValid: true, data };
    }

    // Mode 2: Update by date range
    // Get dateDebut (required)
    let [dateDebut] = findDictValue(DATE_DEBUT_KEYS, body);
    if (!dateDebut) {
      return {
        isValid: false,
        errorMessage: "dateDebut non spécifié",
      };
    }
    dateDebut = dateFormatMongo(dateDebut);

    // Get dateFin (required)
    let [dateFin] = findDictValue(DATE_FIN_KEYS, body);
    if (!dateFin) {
      return {
        isValid: false,
        errorMessage: "dateFin non spécifié",
      };
    }
    dateFin = dateFormatMongo(dateFin);

    // Build date range filter (database format: "dd-mm-yyyy")
    // Parse dd-mm-yyyy strings to Date objects
    const [dayStart, monthStart, yearStart] = dateDebut.split("-");
    const startDate = new Date(yearStart, monthStart - 1, dayStart);

    const [dayEnd, monthEnd, yearEnd] = dateFin.split("-");
    const endDate = new Date(yearEnd, monthEnd - 1, dayEnd);

    // Generate all dates in range as "dd-mm-yyyy" strings
    const dateStrings = generateDateRange(startDate, endDate);

    // Query by date range
    const filter = {
      professional,
      dateFacture: { $in: dateStrings },
    };

    const invoices = await collection.find(filter).toArray();

    if (invoices.length === 0) {
      return {
        isValid: false,
        errorMessage: "Aucune facture ne correspond aux critères indiqués",
      };
    }

    // Check invoice count limit
    if (invoices.length > 100) {
      return {
        isValid: false,
        errorMessage: `Trop de factures trouvées (${invoices.length}). Maximum autorisé : 100`,
      };
    }

    // Format results
    const data = invoices.map((invoice) => ({
      boolean: true,
      numFactureTiers: invoice.numFactureTiers,
      idFacture: invoice.idFacture,
      dateFacture: invoice.dateFacture,
    }));

    return { isValid: true, data };
  } catch (error) {
    return {
      isValid: false,
      errorMessage:
        error.message || "Erreur lors de la récupération des factures",
    };
  }
};

module.exports = { getInvoices };


