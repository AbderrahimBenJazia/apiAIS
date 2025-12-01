const axios = require("axios");

const url =
  "https://zyi0sssm11.execute-api.eu-west-3.amazonaws.com/customerWrite";


const main = async () => {
  const headers = {
    token: "AIS_17Awq-6qAOs-iYcd8-qZdHr-WKg2i-ZYGS1-nFxrb-empb4-mKaLN-d4wY",
  };

  const body = {
    civilite: "M",
    nomNaissance: "{Doe}",
    prenoms: "John",
    numeroTelephonePortable: "0612345678",
    adresseMail: "isTEst@yopmail.com",
    libelleVoie: "10 rue de la paix",
    libelleCommuneResidence: "Paris 1",
    codePostal: "75001",
    dateNaissance: "01-12-2022",
    codePaysNaissance: 99100,
    libelleCommuneNaissance: "Paris 15",
    bic: "AGRIFRPPXXX",
    iban: "FR7630006000011234567890189",
    titulaire: "John Doe",
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
};

main();
