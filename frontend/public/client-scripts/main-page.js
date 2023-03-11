//this is for dropdown menu for pet search on the main page

const inputBox = document.querySelector(".pet-search");
const list = document.getElementById("pet-options");

function showList() {
  list.classList.toggle("hide"); //toggles hide class on and off when input box is clicked
}

function setValue(value) {
  inputBox.value = value;

  list.classList.toggle("hide"); //hides menu after clicking on option
}
