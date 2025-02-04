let actualLat, actualLng;
let guessX, guessY;

const mapBounds = {
  topLeft: { lat: 44.56766730220258, lng: -123.28959983789187 },
  bottomRight: { lat: 44.55977402745042, lng: -123.2750217935866 },
};

function getRandomStreetViewEmbedLink() {
  // generate random latitude and longitude within bounds
  actualLat = Math.random() * (mapBounds.topLeft.lat - mapBounds.bottomRight.lat) + mapBounds.bottomRight.lat;
  actualLng = Math.random() * (mapBounds.bottomRight.lng - mapBounds.topLeft.lng) + mapBounds.topLeft.lng;

  return `https://www.google.com/maps/embed?pb=!4v0!6m8!1m7!1sPLACEHOLDER!2m2!1d${actualLat.toFixed(6)}!2d${actualLng.toFixed(6)}!3f0!4f0!5f0.7820865974627469`;
}

function loadRandomStreetView() {
  const iframe = document.getElementById("street-view-frame");
  iframe.src = getRandomStreetViewEmbedLink();
}

window.onload = loadRandomStreetView;

function latLngToXY(lat, lng, imgWidth, imgHeight) {
  const x = ((lng - mapBounds.topLeft.lng) / (mapBounds.bottomRight.lng - mapBounds.topLeft.lng)) * imgWidth;
  const y = ((mapBounds.topLeft.lat - lat) / (mapBounds.topLeft.lat - mapBounds.bottomRight.lat)) * imgHeight;
  return { x, y };
}

document.getElementById("guess-canvas").addEventListener("click", function(event) {
  const rect = this.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  document.getElementById("coordinates").textContent = `X: ${x}, Y: ${y}`;
  drawGuess(x, y, "blue");
  checkGuess();
});

function drawGuess(x, y, color) {
  const canvas = document.getElementById("guess-canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, 2, 0, 2 * Math.PI);
  ctx.fill();
}

//dont need to calclate score, send user guess and actual coords to database
function checkGuess() {
  const img = document.getElementById("guess-canvas");
  const { x: actualX, y: actualY } = latLngToXY(actualLat, actualLng, img.clientWidth, img.clientHeight);

  drawGuess(actualX, actualY, "red");

  const distance = Math.sqrt((actualX - guessX) ** 2 + (actualY - guessY) ** 2);
  document.getElementById("feedback").innerText = `Distance: ${Math.round(distance)} pixels`;
}