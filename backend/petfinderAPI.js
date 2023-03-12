const axios = require("axios");
const qs = require("querystring"); //stringify axios requests

//get oauth token
async function getAuthToken() {
  let key = process.env.PETFINDER_API_KEY;
  let secret = process.env.PETFINDER_API_SECRET_KEY;
  let token;

  //pass these options to axios to request
  const data = { grant_type: "client_credentials" };
  const options = {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    auth: {
      username: key,
      password: secret,
    },
    data: qs.stringify(data),
    url: "https://api.petfinder.com/v2/oauth2/token",
  };

  try {
    const response = await axios.request(options);
    token = response.data.access_token;

    return token;
  } catch (error) {
    console.log("OAuth Token Error: " + error);
  }
}

async function fetchAnimals() {
  const token = await getAuthToken();
  console.log(token);
}

module.exports = fetchAnimals;
