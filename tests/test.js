const axios = require("axios");

const url = "https://zyi0sssm11.execute-api.eu-west-3.amazonaws.com/token";

const urlMongo = "https://data.mongodb-api.com/app/apiais-xmjrj/endpoint/token";

const main = async () => {
  const headers = {
    keypublic: "630880805c93af270646c5d3",
    keyprivate: "$2a$05$PMoLVKgXcYBIwaFvwYEcvO",
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
    const response = await axios.post(urlMongo, {}, {headers});

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
