const axios = require("axios");

const url =
  "https://zyi0sssm11.execute-api.eu-west-3.amazonaws.com/invoiceRead";

const urlMongo =
  "https://data.mongodb-api.com/app/apiais-xmjrj/endpoint/invoiceRead";

const main = async () => {
  const headers = {
    token:"AIS_vg7sLj2ZsMBd8OoS8xKWWFrYlzuXq3Qyw2I0LDEdNIyNdKJpwm"
  };

  const body={numFactureTiers: '25354_2025-11-15_11:31:52_821989771421',}

  console.log("***********new function*********");
  try {
    const response = await axios.post(url, body, { headers });
    console.log(response.data.data);
  } catch (error) {
    console.log(
      "Error details:",
      error.response?.status,
      error.response?.data || error.message
    );
  }

  console.log("***********old function*********"); 
  try {
    const response = await axios.post(urlMongo, body, { headers });

    console.log(response.data.data);
  } catch (error) {
    console.log(
      "Error details:",
      error.response?.status,
      error.response?.data || error.message
    );
  }
};

main();
