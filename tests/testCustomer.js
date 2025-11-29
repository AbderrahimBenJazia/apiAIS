const axios = require("axios");

const url =
  "https://zyi0sssm11.execute-api.eu-west-3.amazonaws.com/customerWrite";

const main = async () => {
  const headers = {
    token: "AIS_j57dc-KhLLy-oTolx-o8GgH-SIDWp-f8XPN-RsKSy-IvIS9-aNsw5-U5hRs",
  };

  const body = {
    civilite: "M",
    nomNaissance: "{Doe}",
    prenoms: "John",
    numeroTelephonePortable: "0612345678",
    adresseMail: "john.doe@example.com",
    libelleVoie: "10 rue de la paix",
    libelleCommuneResidence: "Paris 1",
    codePostal: "75001",
    dateNaissance: "01-12-2022",
    codePaysNaissance: 99100,
    libelleCommuneNaissance: "Paris",
    bic: "AGRIFRPPXXX",
    iban: "FR7630006000011234567890189",
    titulaire: "John Doe",
  };

  console.log("***********new function*********");
  try {
    const response = await axios.post(url, body, { headers });

    response?.data?.data.forEach((item) => console.log(item));
  } catch (error) {
    console.log(
      "Error details:",
      error.response?.status,
      error.response?.data || error.message
    );
  }
};

main();
