let favPetID;

function getPetID(petID) {
  favPetID = petID;
}

const favBtns = document.getElementsByClassName("fav-btn");

for (let i = 0; i < favBtns.length; i++) {
  favBtns[i].addEventListener("click", (event) => {
    let unfav = event.target.parentElement.parentElement;

    unfav.remove();
    removeFromFav();
  });
}

function removeFromFav() {
  fetch("/remove-from-favorites", {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "POST",
    body: new URLSearchParams({ petID: favPetID }),
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.log("removeFromFav() Error: " + error);
    });
}

function detailsByPetID(petID) {
  fetch("/animal-id", {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "POST",
    body: new URLSearchParams({ petID: petID }),
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      showPetDetails(data);
    })
    .catch((error) => {
      console.log("detailsByPetID Error: " + error);
    });
}

function removeInfo() {
  const infoCard = document.querySelector(".info-card");

  infoCard.remove();
}

function showPetDetails(pet) {
  const body = document.querySelector("body");
  const infoCard = document.createElement("div");

  infoCard.innerHTML = `

  <div class="info-card">
      <button class="close-button" onclick="removeInfo()"><i class="fa-solid fa-x"></i></button>
      <div class="info-card-top">
        <div class="info-card-item">
          <div class="info-card-img" style="background-image: url('${
            pet.photos[0] ? pet.photos[0].full : "../images/no-img.png"
          }')"></div>
        </div>
        <div class="info">
          <h1>${pet.name}</h1>
          <h2>${pet.type}</h2>
          <h2>${pet.age}, ${pet.gender}</h2>
          <h3>Primary breed: ${pet.breeds.primary}</h3> 
          <h3>Secondary breed: ${
            pet.breeds.secondary ? pet.breeds.secondary : "N/A"
          }</h3>
          
          <h3>Size: ${pet.size}</h3>
        </div>
      </div>
      <div class="info-card-mid">
        <div class="info-card-lists">
          <ul>
            <li style="list-style: none; text-decoration: underline">HEALTH</li>
          <li>Spayed/Neutered: ${
            pet.attributes.spayed_neutered ? "Yes" : "No"
          }</li>
         <li> House Trained: ${pet.attributes.house_trained ? "Yes" : "No"}</li>
          <li>Declawed: ${pet.attributes.declawed ? "Yes" : "No"}</li>
          <li>Special Needs: ${pet.attributes.special_needs ? "Yes" : "No"}</li>
           <li> Vaccinated: ${pet.attributes.shots_current ? "Yes" : "No"}</li> 
          </ul>
          <ul>
            <li style="list-style: none; text-decoration: underline">
              GOOD WITH
            </li>
            <li>Children: ${pet.environment.children ? "Yes" : "No"}</li>
            <li>Other dogs: ${pet.environment.dogs ? "Yes" : "No"}</li>
            <li>Other cats: ${pet.environment.cats ? "Yes" : "No"}</li>
          </ul>
        </div>
        <div class="info-desc">
          ${pet.description ? pet.description : ""}
          <a href="${pet.url}" target=_blank>(click here to continue)</a>
        </div>
      </div>
      <div class="info-contact">
        <h1>Contact Organization</h1>
        <h2>Email: ${pet.contact.email ? pet.contact.email : "N/A"}</h2>
        <h2>Phone: ${pet.contact.phone ? pet.contact.phone : "N/A"}</h2>
        <h2>${pet.contact.address.city}, ${pet.contact.address.state}, ${
    pet.contact.address.postcode
  } </h2>
      </div>
    </div>

  `;
  body.appendChild(infoCard);
}
