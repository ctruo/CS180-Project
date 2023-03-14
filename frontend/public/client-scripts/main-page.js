//dropdown menu for pet search on the main page
const inputBox = document.querySelector(".pet-search");
const list = document.getElementById("pet-options");
const arrow = document.getElementsByClassName("fa-angle-up");

//dropdown menu for pet search
function showList() {
  list.classList.toggle("hideDropdown"); //toggles hide class on and off when input box is clicked
  arrow[0].classList.toggle("fa-active"); //flips arrow to down when showing menu
}

//sets input value to value that is clicked on for query
function setValue(value) {
  inputBox.value = value;
}

document.addEventListener("click", (event) => {
  if (event.target != inputBox) {
    list.classList.add("hideDropdown"); //hides menu when clicked off of input box
    arrow[0].classList.remove("fa-active"); //flips arrow back up when menu is hidden
  }
});

//validates pet search form before sending
const petBtn = document.querySelector("#pet-submit");
const petLocationSearch = document.getElementById("petZip");

petBtn.addEventListener("click", (event) => {
  if (!isValidZip(petLocationSearch.value)) {
    //if empty or not valid zip dont submit
    event.preventDefault();
    alert("Please Enter A Valid Zipcode");
  }
});

const shelterBtn = document.querySelector("#shelter-submit");
const shelterLocationSearch = document.getElementById("shelterZip");

shelterBtn.addEventListener("click", (event) => {
  if (!isValidZip(shelterLocationSearch.value)) {
    //if empty or not valid zip dont submit
    event.preventDefault();
    alert("Please Enter A Valid Zipcode");
  }
});

//Helper functions
function isValidZip(zip) {
  return /^\d{5}(-\d{4})?$/.test(zip);
}

//FIXME this is not working as intended
// function showAlert(message) {
//   const alert = document.createElement("div");
//   alert.className = "alert";
//   alert.appendChild(document.createTextNode(message));
//   const container = document.querySelector(".container");
//   const form = document.querySelector("#pet-form");
//   container.insertBefore(alert, form);

//   setTimeout(() => document.querySelector(".alert").remove(), 5000);
// }

//populates the "Meet Furry Friends Nearby" with API data
//get location through IP API https://ip-api.com/
async function getAndPostLocation() {
  fetch("http://ip-api.com/json/")
    .then((response) => {
      if (!response.ok) {
        throw new Error("IP HTTP error status code " + response.status);
      }

      return response.json();
    })
    .then((ipResponse) => {
      postLocation(ipResponse.zip); //post location
    })
    .catch((error) => {
      console.log("LOCATION FETCH ERROR: " + error);
    });
}

//send zipcode to server
async function postLocation(zipcode) {
  const zip = document.getElementById("zipcode");

  zip.textContent = `(${zipcode})`;

  fetch("/user-location", {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "POST",
    body: new URLSearchParams({ zipcode: zipcode }),
  })
    .then((res) => {
      getNearbyPets(); //get nearby pets after sending zip
      return res; //res is just 200 status to indicate succes. we do nothing with it
    })
    .catch((error) => {
      console.log("postLocation() Error: " + error);
    });
}

//gets nearby pets
async function getNearbyPets() {
  fetch("/nearby-pets")
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      showNearbyPets(data);
    })
    .catch((error) => {
      console.log("getNearbyPets() Error: " + error);
    });
}

//show pets in html
//found in main page "Meet Furry Friends Nearby" section
function showNearbyPets(pets) {
  const petList = document.getElementsByClassName("pet-img");
  const petNames = document.getElementsByClassName("pet-img-caption");

  for (let i = 0; i < 4; i++) {
    if (pets[i].photos.length > 0) {
      petList[i].style.backgroundImage =
        "url('" + pets[i].photos[0].full + "')";
    } else {
      //no image available
      petList[i].style.backgroundImage = "url('../images/no-img.png')";
    }

    if (pets[i].name.length <= 18) {
      petNames[i].textContent = pets[i].name;
    } else {
      let name = pets[i].name.slice(0, 15) + "..."; //name is too long
      petNames[i].textContent = name;
    }
  }
}
