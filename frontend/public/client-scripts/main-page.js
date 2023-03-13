//dropdown menu for pet search on the main page
const inputBox = document.querySelector(".pet-search");
const list = document.getElementById("pet-options");
const arrow = document.getElementsByClassName("fa-angle-up");

function showList() {
  list.classList.toggle("hideDropdown"); //toggles hide class on and off when input box is clicked
  arrow[0].classList.toggle("fa-active"); //flips arrow to down when showing menu
}

function setValue(value) {
  //sets input value to value that is clicked on for query
  inputBox.value = value;
}

document.addEventListener("click", (event) => {
  if (event.target != inputBox) {
    list.classList.add("hideDropdown"); //hides menu when clicked off of input box
    arrow[0].classList.remove("fa-active"); //flips arrow back up when menu is hidden
  }
});

//populates the "Meet Furry Friends Nearby" with API data
//get location through IP API https://ip-api.com/
async function getLocation() {
  fetch("http://ip-api.com/json/")
    .then((response) => {
      if (!response.ok) {
        throw new Error("IP HTTP error status code " + response.status);
      }

      return response.json();
    })
    .then((ipResponse) => {
      postLocation(ipResponse.zip);
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
      return res.json();
    })
    .then((data) => {
      showNearbyPets(data);
      console.log(data);
    })
    .catch((error) => {
      console.log("Error: " + error);
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
