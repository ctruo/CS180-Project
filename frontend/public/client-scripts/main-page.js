//this is for dropdown menu for pet search on the main page

const inputBox = document.querySelector(".pet-search");
const list = document.getElementById("pet-options");
const arrow = document.getElementsByClassName("fa-angle-up");

function showList() {
  list.classList.toggle("hide"); //toggles hide class on and off when input box is clicked
  arrow[0].classList.toggle("fa-active"); //flips arrow to down when showing menu
}

function setValue(value) {
  //sets input box to clicked on value for query
  inputBox.value = value;
}

document.addEventListener("click", (event) => {
  if (event.target != inputBox) {
    list.classList.add("hide"); //hides menu when clicked off of input box
    arrow[0].classList.remove("fa-active"); //flips arrow back up when menu is hidden
  }
});
