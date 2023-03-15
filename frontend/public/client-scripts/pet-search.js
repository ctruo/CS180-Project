window.addEventListener("load", () => {
  const type = document.getElementById("type");

  let initialType = type.value;
  switch (type.value) {
    case "Dogs":
      initialType = "dog";
      break;
    case "Cats":
      initialType = "cat";
      break;
    case "Rabbits":
      initialType = "rabbit";
      break;
    case "Small & Furry":
      initialType = "small-furry";
      break;
    case "Horses":
      initialType = "horse";
      break;
    case "Birds":
      initialType = "bird";
      break;
    case "Scales, Fins, & Other":
      initialType = "scales-fins-other";
      break;
    case "Barnyard":
      initialType = "barnyard";
      break;
    default:
      initialType = "dog";
  }

  loadBreedList(initialType);
});

type.addEventListener("change", () => {
  let postType;

  switch (type.value) {
    case "Dogs":
      postType = "dog";
      break;
    case "Cats":
      postType = "cat";
      break;
    case "Rabbits":
      postType = "rabbit";
      break;
    case "Small & Furry":
      postType = "small-furry";
      break;
    case "Horses":
      postType = "horse";
      break;
    case "Birds":
      postType = "bird";
      break;
    case "Scales, Fins, & Other":
      postType = "scales-fins-other";
      break;
    case "Barnyard":
      postType = "barnyard";
      break;
    default:
      postType = "dog";
  }

  loadBreedList(postType);
});

//send type to server to get breed list back
function loadBreedList(postType) {
  const breedList = document.getElementById("breedList");

  fetch("/breed-list", {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "POST",
    body: new URLSearchParams({ type: postType }),
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      showBreedList(data, breedList);
    })
    .catch((error) => {
      console.log("breedList Error: " + error);
    });
}

function showBreedList(data, breedList) {
  breedList.innerHTML = "";

  for (let i = 0; i < data.length; i++) {
    let option = document.createElement("option");
    option.value = data[i].name;
    breedList.appendChild(option);
  }
}

const currentPage = document.getElementById("current-page").innerHTML;
const prevBtn = document.getElementById("prevBtn");
const pageRegex = /\&page=[0-9]+/;

prevBtn.addEventListener("click", () => {
  if (currentPage > 1) {
    if (pageRegex.test(window.location.href)) {
      window.location.href = window.location.href.replace(
        pageRegex,
        `&page=${parseInt(currentPage) - 1}`
      );
    } else {
      window.location.href += `&page=${parseInt(currentPage) - 1}`;
    }
  }
});

const nextBtn = document.getElementById("nextBtn");

nextBtn.addEventListener("click", () => {
  if (pageRegex.test(window.location.href)) {
    window.location.href = window.location.href.replace(
      pageRegex,
      `&page=${parseInt(currentPage) + 1}`
    );
  } else {
    window.location.href += `&page=${parseInt(currentPage) + 1}`;
  }
});

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
      console.log(data);
      showPetDetails(data);
    })
    .catch((error) => {
      console.log("detailsByPetID Error: " + error);
    });
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

function removeInfo() {
  const infoCard = document.querySelector(".info-card");

  infoCard.remove();
}

const favBtns = document.getElementsByClassName("fav-btn");
// const heartIcon = document.querySelector(".cards .fa-heart");

for (let i = 0; i < favBtns.length; i++) {
  favBtns[i].addEventListener("click", (event) => {
    let heartIcon = event.target;
    console.log(heartIcon.classList);

    if (heartIcon.classList.contains("fa-regular")) {
      heartIcon.classList.remove("fa-regular");
      heartIcon.classList.add("fa-solid");
      addToFav();
    } else if (heartIcon.classList.contains("fa-solid")) {
      heartIcon.classList.remove("fa-solid");
      heartIcon.classList.add("fa-regular");
      removeFromFav();
    }
  });
}

function addToFav() {
  console.log("adding");
}

function removeFromFav() {
  console.log("removing");
}
