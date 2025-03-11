
global.fetch = jest.fn();

const { goToPage, showMap, latLngToXY, getRandomStreetViewEmbedLink, startGame, endGame } = require('../public/javascript_files/Page_functions'); // Adjust path

describe("goToPage", () => {
  it("should change window.location.href", () => {
    delete window.location;
    window.location = { href: "" };
    
    goToPage("/testPage");
    
    expect(window.location.href).toBe("/testPage");
  });
});

describe("showMap", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="overlay-map" style="display: none;"></div>
      <canvas id="guess-canvas" style="display: none;"></canvas>
      <button id="show-map-button">Show Map</button>
    `;
  });

  it("should toggle the visibility of the map and canvas", () => {
    showMap();
    
    expect(document.getElementById("overlay-map").style.display).toBe("block");
    expect(document.getElementById("guess-canvas").style.display).toBe("block");
    expect(document.getElementById("show-map-button").textContent).toBe("Hide Map");

    showMap();
    
    expect(document.getElementById("overlay-map").style.display).toBe("none");
    expect(document.getElementById("guess-canvas").style.display).toBe("none");
    expect(document.getElementById("show-map-button").textContent).toBe("Show Map");
  });
});

describe("latLngToXY", () => {
  it("should convert lat/lng to x/y coordinates", () => {
    const result = latLngToXY(44.562, -123.280);
    
    expect(result).toHaveProperty("x");
    expect(result).toHaveProperty("y");
  });
});

describe("getRandomStreetViewEmbedLink", () => {
  it("should return a street view link when fetch is successful", async () => {
    global.fetch.mockResolvedValue({ ok: true });

    const url = await getRandomStreetViewEmbedLink();
    
    expect(url).toContain("https://www.google.com/maps/embed");
  });

  it("should return null when fetch fails", async () => {
    global.fetch.mockResolvedValue({ ok: false });

    const url = await getRandomStreetViewEmbedLink();
    
    expect(url).toBeNull();
  });
});

