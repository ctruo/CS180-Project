const { fetchAnimals, fetchShelters } = require("./petfinderAPI");

describe("fetchAnimals", () => {
  it("fetchAnimals: return array of animals and pagination object when given a valid query", async () => {
    const query = "type=cat";
    const [ animals, pagination ] = await fetchAnimals(query);

    expect(Array.isArray(animals)).toBe(true);
    expect(animals.length).toBeGreaterThan(0);
    for (const animal in animals) {
      expect(animals[animal].type).toBe("Cat");
    }
    expect(typeof pagination).toBe("object");
  });

  it("fetchAnimals: return animals satisfying given parameters or filters", async () => {
    const query = "type=dog&breed=pug&size=small&gender=male&status=adoptable";
    const [ animals, pagination ] = await fetchAnimals(query);

    expect(animals.length).toBeGreaterThan(0);
    for (const animal in animals) {
      expect(animals[animal].type).toBe("Dog");
      expect(animals[animal].breeds.primary == "Pug" || animals[animal].breeds.secondary == "Pug").toBe(true);
      expect(animals[animal].size).toBe("Small");
      expect(animals[animal].gender).toBe("Male");
      expect(animals[animal].status).toBe("adoptable");
    }
  });

  it("fetchAnimals: return animals and correct pagination for a specific page number of results", async () => {
    const query = "page=3";
    const [ animals, pagination ] = await fetchAnimals(query);

    expect(pagination.current_page).toBe(3);
  });

  it("fetchAnimals: return a number of animal results not exceeding a given limit", async () => {
    const query = "limit=7";
    const [ animals, pagination ] = await fetchAnimals(query);
    expect(animals.length).toBe(7);
  });

  it("fetchAnimals: return nearby animals within a given distance from the user's zip", async () => {
    const userZip = "92521";
    const miles = "100";
    const query = `location=${userZip}&limit=4&sort=random&distance=${miles}`;
    const [ animals, pagination ] = await fetchAnimals(query);

    expect(animals.length).toBe(4);
    for (const animal in animals) {
      expect(parseInt(animals[animal].distance)).toBeLessThan(parseInt(miles) + 50);
    }
  });
});

describe("fetchShelters", () => {
  it("fetchShelters: return array of shelters and pagination object when given a valid query", async () => {
    const query = "country=US";
    const [ organizations, pagination ] = await fetchShelters(query);

    expect(Array.isArray(organizations)).toBe(true);
    expect(organizations.length).toBeGreaterThan(0);
    for (const org in organizations) {
      expect(organizations[org].address.country).toBe("US");
    }
    expect(typeof pagination).toBe("object");
  });

  it("fetchShelters: return shelters located in a given state and correct pagination given a page number of results", async () => {
    const query = "state=CA&page=2";
    const [ organizations, pagination ] = await fetchShelters(query);

    expect(pagination.current_page).toBe(2);
    for (const org in organizations) {
      expect(organizations[org].address.state).toBe("CA");
    }
  });

  it("fetchShelters: return a number of shelter results not exceeding a given limit", async () => {
    const query = "limit=3";
    const [ organizations, pagination ] = await fetchShelters(query);
    expect(organizations.length).toBe(3);
  });

  it("fetchShelters: return nearby shelters within a given distance from the user's zip", async () => {
    const userZip = "92521";
    const miles = "100";
    const query = `location=${userZip}&distance=${miles}`;
    const [ organizations, pagination ] = await fetchShelters(query);

    expect(organizations.length).toBeGreaterThan(0);
    for (const org in organizations) {
      expect(parseInt(organizations[org].distance)).toBeLessThan(parseInt(miles) + 100);
    }
  });
});

