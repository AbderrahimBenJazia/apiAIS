const axios = require("axios");

const url =
  "https://zyi0sssm11.execute-api.eu-west-3.amazonaws.com/customerWrite";

const main = async () => {
  const headers = {
    token:"AIS_BXn6C-aGu5O-ySUoZ-5RcjV-uww3M-mqAtT-FJlCr-HRFgw-Q1OKM-Cl8"
  };

  const body={}

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

  
};

main();
