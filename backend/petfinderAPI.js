const axios = require("axios");
const qs = require("querystring"); //stringify axios options

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

//fetch animals with a query
async function fetchAnimals(query) {
  const token = await getAuthToken();

  let URL = `https://api.petfinder.com/v2/animals?${query}`;

  try {
    const response = await axios.get(URL, {
      headers: { Authorization: "Bearer " + token },
    });

    return [response.data.animals, response.data.pagination];
  } catch (error) {
    console.log("fetchAnimals Error: " + error);
  }
}

//fetch animal details with a query
async function fetchAnimalByID(query) {
  const token = await getAuthToken();

  let URL = `https://api.petfinder.com/v2/animals/${query}`;

  try {
    const response = await axios.get(URL, {
      headers: { Authorization: "Bearer " + token },
    });

    return response.data.animal;
  } catch (error) {
    console.log("fetchAnimalByID Error: " + error);
  }
}

//fetch animal breeds with a query
async function fetchAnimalBreeds(query) {
  const token = await getAuthToken();

  let URL = `https://api.petfinder.com/v2/types/${query}/breeds`;

  try {
    const response = await axios.get(URL, {
      headers: { Authorization: "Bearer " + token },
    });

    return response.data.breeds;
  } catch (error) {
    console.log("fetchAnimalBreeds Error: " + error);
  }
}

//fetch shelters with a query
async function fetchShelters(query) {
  const token = await getAuthToken();

  let URL = `//api.petfinder.com/v2/organizations?${query}`;

  try {
    const response = await axios.get(URL, {
      headers: { Authorization: "Bearer " + token },
    });

    return [response.data.organizations, response.data.pagination];
  } catch (error) {
    console.log("fetchShelters Error: " + error);
  }
}

module.exports = {
  fetchAnimals,
  fetchAnimalByID,
  fetchAnimalBreeds,
  fetchShelters,
};