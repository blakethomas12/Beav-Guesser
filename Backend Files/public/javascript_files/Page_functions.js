// Functions here are used by the html files to perform actions - Gavin Fifer
function goToPage(route) {
  window.location.href = route;
}

let actualLat, actualLng;
let guessX, guessY;

const mongoose = require('mongoose');
const dbFunctions = require('../../Backend Files/db.js');

mongoose.connect(
  "mongodb+srv://thomblak:Q8w8rOO3EisNKGTA@beavguesser.q3c0f.mongodb.net/?retryWrites=true&w=majority&appName=BeavGuesser"
);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('Connected to MongoDB');
});

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
  alert("The click worked");
  const rect = this.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
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

//dont need to calculate score, send user guess and actual coords to database
function checkGuess() {
  const img = document.getElementById("guess-canvas");
  const { x: actualX, y: actualY } = latLngToXY(actualLat, actualLng, img.clientWidth, img.clientHeight);

  drawGuess(actualX, actualY, "red");

  const distance = Math.sqrt((actualX - guessX) ** 2 + (actualY - guessY) ** 2);
  document.getElementById("feedback").innerText = `Distance: ${Math.round(distance)} pixels`;
}

async function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  try {
    const response = await fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: username, password: password }),
    });
  } catch (error) {
    console.error("Error logging in:", error);
  }
}

async function logout() {
  console.log("logging out");
  const response = await fetch("/logout", {
    method: "POST",
  });
  if (response.redirected) {
    window.location.href = response.url;
  }
}

async function register() {
  const username = document.getElementById('username').value.trim()
  const password1 = document.getElementById('password').value.trim()
  const password2 = document.getElementById('confirm-password').value.trim()

  if(password1 === password2){

    const response = await fetch("/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({username: username, password: password1})
    })

    const result = await response.json()
    if(result.message === "success"){
      window.location.href = '/login'
      alert("Sign Up Successful! You can now log in")
    }else if(result.message === "taken"){
      alert("That username is taken! Please try another")
    }else{
      alert("There was an error signing up. Please try again soon!")
    }
  }else{
    alert("Passwords do not match!")
  }
}
