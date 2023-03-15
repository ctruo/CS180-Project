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
