const axios = require("axios");

const url = "https://zyi0sssm11.execute-api.eu-west-3.amazonaws.com/token";

const urlMongo = "https://data.mongodb-api.com/app/apiais-xmjrj/endpoint/token";

const main = async () => {
  const headers = {
    // Avec mention

    /*     keypublic: "62aca459c2b5b7cec2d1e0e9",
    keyprivate: "$2a$05$uGg3agYWq9gt9xqXcuO0lu", */

    //Mon compte
    keypublic: "apiPublic_oKmN8-SgaZ5-sCpfQ-T0hTo",
    keyprivate: "apiPrivate_yvEm0-SDvce-M1cXt-74VUC",
  };

  console.log("***********new function*********");
  try {
    const response = await axios.post(url, {}, { headers });

    console.log(response.data);
  } catch (error) {
    console.log(
      "Error details:",
      error.response?.status,
      error.response?.data || error.message
    );
  }

  console.log("***********old function*********");
  try {
    const response = await axios.post(urlMongo, {}, { headers });

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
