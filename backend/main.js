// import { isValidZip, showAlert } from "./validate";

// require("dotenv").config();

// const petForm = document.querySelector("#pet-form");

// petForm.addEventListener("submit", fetchAnimals);

// function fetchAnimals(e) {
//   e.preventDefault();

//   const animal = document.querySelector("#animal").value;
//   const zip = document.querySelector("#zip").value;

//   if (!isValidZip(zip)) {
//     showAlert("Please Enter A Valid Zipcode", "danger");
//     return;
//   }

//   let key = process.env.PETFINDER_API_KEY;
//   let secret = process.env.PETFINDER_API_SECRET_KEY;
//   let token;

//   fetch("https://api.petfinder.com/v2/oauth2/token", {
//     method: "POST",
//     body:
//       "grant_type=client_credentials&client_id=" +
//       key +
//       "&client_secret=" +
//       secret,
//     headers: {
//       "Content-Type": "application/x-www-form-urlencoded",
//     },
//   })
//     .then((res) => res.json())
//     .then((data) => {
//       token = data.access_token;
//     })
//     .then(() => {
//       fetch(
//         `https://api.petfinder.com/v2/animals?type=${animal}&location=${zip}`,
//         {
//           method: "GET",
//           mode: "cors",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: "Bearer " + token,
//           },
//         }
//       )
//         .then((res) => res.json())
//         .then((data) => showAnimals(data.animals));
//     })
//     .catch((err) => console.error(err));
// }

// function showAnimals(pets) {
//   const results = document.querySelector("#results");

//   results.innerHTML = "";

//   pets.forEach((pet) => {
//     const div = document.createElement("div");
//     div.innerHTML =  `
// <div class = "cards">
//   <div class = "card">
//     <img  class = "card_image" src="${ pet.photos[0] ? pet.photos[0].medium : ""}">
//     <div class = "card_content">
//       <h4>${pet.name} (${pet.age})</h4>
//       <p class="text-secondary">${pet.breeds.primary}</p>
//       <p>${pet.contact.address.city}, ${pet.contact.address.state} ${
//         pet.contact.address.postcode
//       }</p>
//     </div>
//     <div class = "card_info">
//       <p>${pet.contact.address.city}, ${pet.contact.address.state} ${
//         pet.contact.address.postcode
//       }</p>
//     </div>
//   </div>
// </div>
{
  /* results.appendChild(div);
  });
} */
}
