const axios = require("axios");

const url =
  "https://zyi0sssm11.execute-api.eu-west-3.amazonaws.com/customerWrite";

const urlMongo =
  "https://data.mongodb-api.com/app/apiais-xmjrj/endpoint/customerWrite";

const main = async () => {
  const headers = {
    token: "AIS_StY5g-ePKhR-C3aKW-ngzxo-ibFVg-LlUjS-roaRD-Ad6uj-dVsn2-B51eI",
  };

  const body = {
    civilite: "1",
    nomNaissance: "BEN JAZIA",
    nomUsage: "BEN JAZIA",
    prenoms: "Abderrahim",
    numeroTelephonePortable: "0619868950",
    adresseMail: "benjazia.abde@gmail.com",
    libelleVoie: "83 promenade des anglais",
    libelleCommuneResidence: "Nice",
    codePostal: "06000",
    dateNaissance: "15/03/1991",
    codePaysNaissance: 99351,
    bic: "AGRIFRPPXXX",
    iban: "FR76 3000 6000 0112 3456 7890 189",
  };

  console.log("***********new function*********");
  try {
    const response = await axios.post(url, body, { headers });

    console.log(response.data);
  } catch (error) {
    console.log(
      "Error details:",
      error.response?.status,
      error.response?.data || error.message
    );
  }

  console.log("***********old function*********");

  /*  try {
    const response = await axios.post(urlMongo, body, { headers });

    console.log(response.data);
  } catch (error) {
    console.log(
      "Error details:",
      error.response?.status,
      error.response?.data || error.message
    );
  }
 */
};
main();
