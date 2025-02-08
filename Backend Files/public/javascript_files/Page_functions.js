// Functions here are used by the html files to perform actions - Gavin Fifer
function goToPage(route) {
  window.location.href = route;
}

function getRandomStreetViewEmbedLink() {
  // define bounding box coordinates
  const bounds = {
    topLeft: { lat: 44.56766730220258, lng: -123.28959983789187 },
    topRight: { lat: 44.56725015537913, lng: -123.2722258248906 },
    bottomRight: { lat: 44.55977402745042, lng: -123.2750217935866 },
    bottomLeft: { lat: 44.55767469824912, lng: -123.2896888691443 },
  };

  // generate random latitude and longitude within bounds
  const randomLat =
    Math.random() * (bounds.topLeft.lat - bounds.bottomLeft.lat) +
    bounds.bottomLeft.lat;
  const randomLng =
    Math.random() * (bounds.topRight.lng - bounds.topLeft.lng) +
    bounds.topLeft.lng;

  // construct street view embed link
  const embedLink = `https://www.google.com/maps/embed?pb=!4v0!6m8!1m7!1sPLACEHOLDER!2m2!1d${randomLat.toFixed(
    6
  )}!2d${randomLng.toFixed(6)}!3f0!4f0!5f0.7820865974627469`;

  return embedLink;
}

function loadRandomStreetView() {
  const iframe = document.getElementById("streetViewFrame");
  const randomLink = getRandomStreetViewEmbedLink();
  iframe.src = randomLink;
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
