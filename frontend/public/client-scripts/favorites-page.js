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
