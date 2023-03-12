//this is for dropdown menu for pet search on the main page
const inputBox = document.querySelector(".pet-search");
const list = document.getElementById("pet-options");
const arrow = document.getElementsByClassName("fa-angle-up");

function showList() {
  list.classList.toggle("hideDropdown"); //toggles hide class on and off when input box is clicked
  arrow[0].classList.toggle("fa-active"); //flips arrow to down when showing menu
}

function setValue(value) {
  //sets input box to clicked on value for query
  inputBox.value = value;
}

document.addEventListener("click", (event) => {
  if (event.target != inputBox) {
    list.classList.add("hideDropdown"); //hides menu when clicked off of input box
    arrow[0].classList.remove("fa-active"); //flips arrow back up when menu is hidden
  }
});

//this function populates the "Meet Furry Friends Nearby" with API data
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
  fetch("/pets-nearby", {
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
      console.log(data);
    })
    .catch((error) => {
      console.log("Error: " + error);
    });
}
