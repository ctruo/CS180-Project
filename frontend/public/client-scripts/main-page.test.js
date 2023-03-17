const indexHTML = createJSDOM("index.ejs", { loggedIn: true });
const { getAndPostLocation, showNearbyPets } = require("./main-page");

describe("showNearbyPets", () => {
  beforeEach(() => {
    document.body.innerHTML = indexHTML;
  });

  it("truncate pet name if it is too long", () => {
    const petList = document.getElementsByClassName("pet-img");
    const petNames = document.getElementsByClassName("pet-img-caption");
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

    expect(petList[1].style.backgroundImage).toEqual(`url(${petData[1].photos[0].full})`);
    expect(petNames[1].textContent).toEqual("Supercalifragil...");
  });

  it("use default image if no images available", () => {
    const petList = document.getElementsByClassName("pet-img");
    const petNames = document.getElementsByClassName("pet-img-caption");
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

    expect(petList[1].style.backgroundImage).toEqual(`url(../images/no-img.png)`);
    expect(petNames[1].textContent).toEqual(petData[1].name);
  });
});

describe("Meet Furry Friends Nearby", () => {
  const mockZipcodeRes = { zip: "92521" };
  const mockPetDataRes = [
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

  beforeAll(() => {
    document.body.innerHTML = indexHTML;

    fetch = jest.fn();
    fetch
      .mockImplementationOnce(() => 
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockZipcodeRes),
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({})
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          json: () => Promise.resolve(mockPetDataRes),
        })
      );

    getAndPostLocation();
  });

  it("postLocation: set the text content of #zipcode to the correct zip from response", async () => {
    expect(document.getElementById("zipcode").textContent).toBe("(92521)");
  });

  it("showNearbyPets: html is updated with correct pet images and names", () => {
    const petList = document.getElementsByClassName("pet-img");
    const petNames = document.getElementsByClassName("pet-img-caption");

    expect(petList[0].style.backgroundImage).toEqual(`url(${mockPetDataRes[0].photos[0].full})`);
    expect(petNames[0].textContent).toEqual(mockPetDataRes[0].name);

    expect(petList[1].style.backgroundImage).toEqual(`url(${mockPetDataRes[1].photos[0].full})`);
    expect(petNames[1].textContent).toEqual(mockPetDataRes[1].name);
    
    expect(petList[2].style.backgroundImage).toEqual(`url(${mockPetDataRes[2].photos[0].full})`);
    expect(petNames[2].textContent).toEqual(mockPetDataRes[2].name);

    expect(petList[3].style.backgroundImage).toEqual(`url(${mockPetDataRes[3].photos[0].full})`);
    expect(petNames[3].textContent).toEqual(mockPetDataRes[3].name);
  });
});

