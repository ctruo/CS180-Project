const { fetchAnimals, fetchShelters } = require("./petfinderAPI");

// API keys for testing
process.env.PETFINDER_API_KEY = "kanvfWhgZWl1sa0LVfG4eCbmfEZ7OaMYlOVTfr3bXC178z3C00";
process.env.PETFINDER_API_SECRET_KEY = "tw546gKGW6i7mtMQEdpRyKixKo3hIQAcjOMxWQfR";

describe("fetchAnimals", () => {
  beforeEach(() => {
    jest.spyOn(console, "log");
    jest.spyOn(console, "error");
    jest.resetAllMocks();
  });

  it("fetchAnimals: return an array of animals with a specified parameter", async () => {
    const query = "type=cat";
    const animals = await fetchAnimals(query);

    expect(Array.isArray(animals)).toBe(true);
    expect(animals.length).toBeGreaterThan(0);
    for (const animal in animals) {
      expect(animals[animal].type).toBe("Cat");
    }
  });

  it("fetchAnimals: return an array of animals with multiple parameters specified", async () => {
    const query = "type=dog&breed=pug&size=small&gender=male&status=adoptable";
    const animals = await fetchAnimals(query);

    expect(animals.length).toBeGreaterThan(0);
    for (const animal in animals) {
      expect(animals[animal].type).toBe("Dog");
      expect(animals[animal].breeds.primary == "Pug" || animals[animal].breeds.secondary == "Pug").toBe(true);
      expect(animals[animal].size).toBe("Small");
      expect(animals[animal].gender).toBe("Male");
      expect(animals[animal].status).toBe("adoptable");
    }
  });

  it("fetchAnimals: return only 7 animals when specified limit is 7", async () => {
    const query = "limit=7";
    const animals = await fetchAnimals(query);
    expect(animals.length).toBe(7);
  });

  it("fetchAnimals: return an array of animals near a specified zip code", async () => {
    const userZip = "92521";
    const miles = "100";
    const query = `location=${userZip}&limit=4&sort=random&distance=${miles}`;
    const animals = await fetchAnimals(query);

    expect(animals.length).toBe(4);
    for (const animal in animals) {
      expect(parseInt(animals[animal].distance)).toBeLessThan(parseInt(miles) + 50);
    }
  });
});

describe("fetchShelters", () => {
  beforeEach(() => {
    jest.spyOn(console, "log");
    jest.spyOn(console, "error");
    jest.resetAllMocks();
  });

  it("fetchShelters: return an array of organizations in the US along with pagination data", async () => {
    const query = "country=US";
    const [ organizations, pagination ] = await fetchShelters(query);

    expect(Array.isArray(organizations)).toBe(true);
    expect(organizations.length).toBeGreaterThan(0);
    for (const org in organizations) {
      expect(organizations[org].address.country).toBe("US");
    }
    expect(typeof pagination).toBe("object");
  });

  it("fetchShelters: return an array of organizations in CA on a specified page", async () => {
    const query = "state=CA&page=2";
    const [ organizations, pagination ] = await fetchShelters(query);

    expect(pagination.current_page).toBe(2);
    for (const org in organizations) {
      expect(organizations[org].address.state).toBe("CA");
    }
  });

  it("fetchShelters: return only 3 organizations when specified limit is 3", async () => {
    const query = "limit=3";
    const [ organizations, pagination ] = await fetchShelters(query);
    expect(organizations.length).toBe(3);
  });

  it("fetchShelters: return organizations near a specified zip code", async () => {
    const userZip = "92521";
    const miles = "100";
    const query = `location=${userZip}&distance=${miles}`;
    const [ organizations, pagination ] = await fetchShelters(query);

    expect(organizations.length).toBeGreaterThan(0);
    for (const org in organizations) {
      expect(parseInt(organizations[org].distance)).toBeLessThan(parseInt(miles) + 50);
    }
  });
});

