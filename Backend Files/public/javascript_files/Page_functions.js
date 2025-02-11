// Functions here are used by the html files to perform actions - Gavin Fifer
function goToPage(route) {
  window.location.href = route;
}

function showMap() {
  const map = document.getElementById("overlay-map");
  const canvas = document.getElementById("guess-canvas");
  const button = document.getElementById("show-map-button")
  if (map.style.display === "none") {
    map.style.display = "block";
    button.textContent = "Hide Map";
  } else {
    map.style.display = "none";
    button.textContent = "Show Map";
  }
  if (canvas.style.display === "none") {
    canvas.style.display = "block";
  } else {
    canvas.style.display = "none";
  }

}

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
  const iframe = document.getElementById("streetViewFrame");
  iframe.src = getRandomStreetViewEmbedLink();
}

document.addEventListener("DOMContentLoaded", function () {
  loadRandomStreetView();

  const canvas = document.getElementById("guess-canvas");
  if (canvas) {
    //debugging: check is canvas if loaded
    console.log("canvas found");
    canvas.addEventListener("click", function(event) {
      //debug: check if click is registered on canvas
      console.log("canvas click registered");
      const rect = canvas.getBoundingClientRect();
      guessX = event.clientX - rect.left;
      guessY = event.clientY - rect.top;

      //debugging: check click coordinates
      console.log(`click coordinates: X=${guessX}, Y=${guessY}`);

      //debugging: check what element is clicked on
      const clickedElement = document.elementFromPoint(event.clientX, event.clientY);
      console.log("element clicked on:", clickedElement);
      
      //drawGuess(guessX, guessY, "blue");
      checkGuess();
    });
  } else {
    //debugging: canvas is not being loaded
    console.error("guess canvas is not found");
  }
});

function latLngToXY(lat, lng, imgWidth, imgHeight) {
  const x = ((lng - mapBounds.topLeft.lng) / (mapBounds.bottomRight.lng - mapBounds.topLeft.lng)) * imgWidth;
  const y = ((mapBounds.topLeft.lat - lat) / (mapBounds.topLeft.lat - mapBounds.bottomRight.lat)) * imgHeight;
  return { x, y };
}

function drawGuess(x, y, color) {
  //debugging: check if draw guess is succesfully being called
  console.log("succesfully called drawGuess");

  const canvas = document.getElementById("guess-canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, 5, 0, 2 * Math.PI);
  ctx.fill();
}

//dont need to calculate score, send user guess and actual coords to database
function checkGuess() {
  const img = document.getElementById("guess-canvas");
  const { x: actualX, y: actualY } = latLngToXY(actualLat, actualLng, img.clientWidth, img.clientHeight);

  drawGuess(guessX, guessY, "blue");
  drawGuess(actualX, actualY, "red");

  const distance = Math.sqrt((actualX - guessX) ** 2 + (actualY - guessY) ** 2);
  document.getElementById("feedback").innerText = `Distance: ${Math.round(distance)} pixels`;
}

async function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const staySignedIn = document.getElementById('stay-signed-in').checked

  if(username && password){
    try {
      const response = await fetch("/loginUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: username, password: password, staySignedIn: staySignedIn }),
      });
      if (response.redirected) {
        window.location.href = response.url;
      }
      const result = await response.json()
      if(result.message = "fail"){
        alert("Username or Password is incorrect!")
      }
    } catch (error) {
      console.error("Error logging in:", error);
    }
  }
}

async function logout() {
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

async function submitScore(score) {
  const response = await fetch("/submitScore", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ score: score }),
  });

  const result = await response.json();
  if (result.message === "success") {
    alert("Score Submitted!");
  } else {
    alert("There was an error submitting your score. Please try again.");
  }
}
