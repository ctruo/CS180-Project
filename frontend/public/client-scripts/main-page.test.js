const mainpage = require("./main-page");

describe("postLocation", () => {
  const postLocation = mainpage.postLocation;

  beforeAll(() => {
    fetch = jest.fn(() => Promise.resolve({}));

    const zip = document.createElement("div");
    zip.id = "zipcode";
    document.body.appendChild(zip);

    postLocation("92521");
  });

  afterAll(() => {
    document.getElementById("zipcode").remove();
  });

  it("text content of #zipcode is set to provided zip", () => {
    expect(document.getElementById("zipcode").textContent).toBe("(92521)");
  });
});

describe("showNearbyPets", () => {
  const showNearbyPets = mainpage.showNearbyPets;
  beforeAll(() => {
    document.body.innerHTML = `
      <div class="pet-img"></div>
      <div class="pet-img"></div>
      <div class="pet-img"></div>
      <div class="pet-img"></div>
      <div class="pet-img-caption"></div>
      <div class="pet-img-caption"></div>
      <div class="pet-img-caption"></div>
      <div class="pet-img-caption"></div>
    `;
  });

  it("html is updated with correct pet images and names", () => {
    const petData = [
      {
        photos: [{ full: "http://mockurl.com/kujo.png" }],
        name: "Kujo",
      },
      {
        photos: [{ full: "http://mockurl.com/ellie.png" }],
        name: "Ellie",
      },
      {
        photos: [{ full: "http://mockurl.com/bonnie.png" }],
        name: "Bonnie",
      },
      {
        photos: [{ full: "http://mockurl.com/chase.png" }],
        name: "Chase",
      },
    ];
  
    showNearbyPets(petData);

    const petList = document.getElementsByClassName("pet-img");
    const petNames = document.getElementsByClassName("pet-img-caption");

    expect(petList[0].style.backgroundImage).toEqual(`url(${petData[0].photos[0].full})`);
    expect(petNames[0].textContent).toEqual(petData[0].name);

    expect(petList[1].style.backgroundImage).toEqual(`url(${petData[1].photos[0].full})`);
    expect(petNames[1].textContent).toEqual(petData[1].name);
    
    expect(petList[2].style.backgroundImage).toEqual(`url(${petData[2].photos[0].full})`);
    expect(petNames[2].textContent).toEqual(petData[2].name);

    expect(petList[3].style.backgroundImage).toEqual(`url(${petData[3].photos[0].full})`);
    expect(petNames[3].textContent).toEqual(petData[3].name);
  });

  it("pet name is truncated if it is too long", () => {
    const petData = [
      {
        photos: [{ full: "http://mockurl.com/kujo.png" }],
        name: "Kujo",
      },
      {
        photos: [{ full: "http://mockurl.com/super.png" }],
        name: "Supercalifragilisticexpialidocious",
      },
      {
        photos: [{ full: "http://mockurl.com/ellie.png" }],
        name: "Ellie",
      },
      {
        photos: [{ full: "http://mockurl.com/bonnie.png" }],
        name: "Bonnie",
      },
    ];

    showNearbyPets(petData);

    const petList = document.getElementsByClassName("pet-img");
    const petNames = document.getElementsByClassName("pet-img-caption");

    expect(petList[1].style.backgroundImage).toEqual(`url(${petData[1].photos[0].full})`);
    expect(petNames[1].textContent).toEqual("Supercalifragil...");
  });

  it("default image is used if no images provided", () => {
    const petData = [
      {
        photos: [{ full: "http://mockurl.com/kujo.png" }],
        name: "Kujo",
      },
      {
        photos: [],
        name: "Ellie",
      },
      {
        photos: [{ full: "http://mockurl.com/bonnie.png" }],
        name: "Bonnie",
      },
      {
        photos: [{ full: "http://mockurl.com/chase.png" }],
        name: "Chase",
      },
    ];

    showNearbyPets(petData);

    const petList = document.getElementsByClassName("pet-img");
    const petNames = document.getElementsByClassName("pet-img-caption");

    expect(petList[1].style.backgroundImage).toEqual(`url(../images/no-img.png)`);
    expect(petNames[1].textContent).toEqual(petData[1].name);
  });
});

