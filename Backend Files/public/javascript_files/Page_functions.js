// Functions here are used by the html files to perform actions - Gavin Fifer
function goToPage(route) {
  window.location.href = route;
}

function showMap() {
  const map = document.getElementById("overlay-map");
  const canvas = document.getElementById("guess-canvas");
  const button = document.getElementById("show-map-button")

  const isHidden = window.getComputedStyle(map).display === "none";

  map.style.display = isHidden ? "block" : "none";
  canvas.style.display = isHidden ? "block" : "none";
  button.textContent = isHidden ? "Hide Map" : "Show Map";
}

let actualLat, actualLng;
let guessX, guessY;
const canvasX = 600;
const canvasY = 487;

let totalScore = 0;
let currentRound = 1;
const totalRounds = 5;

//map boundaries
const mapBounds = {
  topLeft: { lat: 44.567887, lng: -123.289790 },
  bottomRight: { lat: 44.557734, lng: -123.272139 },
};

//conversion
function latLngToXY(lat, lng) {
  const scaleX = canvasX / (mapBounds.bottomRight.lng - mapBounds.topLeft.lng);
  const scaleY = canvasY / (mapBounds.topLeft.lat - mapBounds.bottomRight.lat);
  let x = (lng - mapBounds.topLeft.lng) * scaleX;
  let y = (mapBounds.topLeft.lat - lat) * scaleY;
  return { x, y };
}



// Function to get a random street view embed link
async function getRandomStreetViewEmbedLink() {
  // Generates random latitude and longitude within bounds
  actualLat = Math.random() * (mapBounds.topLeft.lat - mapBounds.bottomRight.lat) + mapBounds.bottomRight.lat;
  actualLng = Math.random() * (mapBounds.bottomRight.lng - mapBounds.topLeft.lng) + mapBounds.topLeft.lng;

  const streetViewUrl = `https://www.google.com/maps/embed?pb=!4v0!6m8!1m7!1sPLACEHOLDER!2m2!1d${actualLat.toFixed(6)}!2d${actualLng.toFixed(6)}!3f0!4f0!5f0.7820865974627469`;

  // Check if the street view is available
  const response = await fetch(streetViewUrl);
  if (response.ok) {
    return streetViewUrl;
  } else {
    return null;
  }
}

// Function to load the random street view
async function loadRandomStreetView() {
  const iframe = document.getElementById("streetViewFrame");
  const streetViewLink = await getRandomStreetViewEmbedLink();
  if (streetViewLink) {
    iframe.src = streetViewLink;
    iframe.style.display = "block";
  } else {
    iframe.style.display = "none";
  }
}

// Ensure everything is loaded
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM loaded");

  if (window.location.pathname === "/guesser") {
    startGame();
  }
});

//when "play game", game will start from here
//manages what is shown and hidden
function startGame(){
  console.log("game started");  //debugging
  totalScore = 0;
  currentRound = 1;

  //displays show map button
  const showMapButton = document.getElementById("show-map-button");
  if(showMapButton){
    showMapButton.style.display = "block";
    showMapButton.textContent = "Show Map"; //reverts text back
  }

  //displays current round
  const roundMessage = document.getElementById("current-round");
  if(roundMessage){
    roundMessage.style.display = "block";
    roundMessage.textContent = `Round: ${currentRound}/${totalRounds}`;
  }

  //hides the result score
  const resultMessage = document.getElementById("game-result-message");
  if (resultMessage) {
    resultMessage.style.display = "none"; //hide score
  }

  //hides the restart game button
  const restartButton = document.getElementById("restart-game-button");
  if (restartButton) {
    restartButton.style.display = "none"; //hide restart button
  }

  //hide home button
  const homeButton = document.getElementById("go-home-button");
  if(homeButton){
    homeButton.style.display = "none";
  }

  //hides the next round button
  const nextRoundButton = document.getElementById("next-round-button");
  if(nextRoundButton){
    nextRoundButton.style.display = "none";    //hide the next round button 
  }

  //displays the street view, it will be blocked when the game ends
  const streetViewFrame = document.getElementById("streetViewFrame");
  if (streetViewFrame) {
    streetViewFrame.style.display = "block"; //show street view
  }
  
  const scoreElement = document.getElementById("score");
  if (scoreElement) {
    scoreElement.style.display = "block";
    scoreElement.innerText = "Score: 0 points";
  }

  loadRandomStreetView();

  const canvas = document.getElementById("guess-canvas")
  // if (canvas && !canvas.hasClickListener) {
  //   canvas.style.display = "block";
  //   canvas.addEventListener("click", processClick);
  //   canvas.hasClickListener = true; //prevent duplicate listeners
  // }
  if (canvas) {
    canvas.style.pointerEvents = "all";
    canvas.removeEventListener("click", processClick);
    canvas.addEventListener("click", processClick);
  }
}

//game end display
//manages what is shown and hidden
function endGame(){
  //hide street view
  const iframe = document.getElementById("streetViewFrame");
  if (iframe) {
    iframe.style.display = "none";
  }

  //hide show map button
  const showMapButton = document.getElementById("show-map-button");
  if(showMapButton){
    showMapButton.style.display = "none";
  }

  //hide map
  const map = document.getElementById("overlay-map");
  if(map){
    map.style.display="none";
  }

  //hide guess canvas
  const guessCanvas = document.getElementById("guess-canvas");
  if(guessCanvas){
    guessCanvas.style.display="none";
  }  

  //hides the next round button
  const nextRoundButton = document.getElementById("next-round-button");
  if(nextRoundButton){
    nextRoundButton.style.display = "none";    //hide the next round button 
  }

  //hides score display
  const score = document.getElementById("score");
  if(score){
    score.style.display = "none";    //hide the next round button 
  }

  //clear canvas
  const canvas = document.getElementById("guess-canvas");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  //show the final score and replace the round message
  const roundMessage = document.getElementById("current-round");
  const resultMessage = document.getElementById("game-result-message");
  if (resultMessage && roundMessage) {
    roundMessage.style.display = "none";
    resultMessage.textContent = `Game Over! Your total score: ${totalScore}`;
    resultMessage.style.display = "block"; 
  }
  
  //show restart game button
  const restartGameButton = document.getElementById("restart-game-button");
  if(restartGameButton){
    restartGameButton.style.display = "block";
  }

  //show home button
  const homeButton = document.getElementById("go-home-button");
  if(homeButton){
    homeButton.style.display = "block";
  }
}

//how user guesses are processed
function processClick(event) {
  const canvas = event.target;
  const rect = canvas.getBoundingClientRect();
  guessX = event.clientX - rect.left;
  guessY = event.clientY - rect.top;

  if (currentRound <= totalRounds) {
    // Log the current round before processing the guess
    console.log(`Current Round: ${currentRound}`);

    checkGuess();

    // Increment current round
    currentRound++;

    //show the next round button when user makes a guess
    const nextRoundButton = document.getElementById("next-round-button");
    if(nextRoundButton){
      nextRoundButton.style.display = "block";   
    }
  }
}

//simulates each round, triggered by next-round-button 
function nextRound(){
  //checks to see if more rounds are left
  if (currentRound <= totalRounds) {
    const roundMessage = document.getElementById("current-round");
    //update round message
    if (roundMessage) {
      roundMessage.textContent = `Round: ${currentRound}/${totalRounds}`;
    }

    //clear and hide the canvas/map 
    const canvas = document.getElementById("guess-canvas");
    const ctx = canvas.getContext("2d");
    const map = document.getElementById("overlay-map");
    const button = document.getElementById("show-map-button")
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.style.display = "none";
    map.style.display = "none";
    button.textContent = "Show Map";
    
    loadRandomStreetView();

    canvas.style.pointerEvents = "all";

    //hide the button again after clicking on it
    const nextRoundButton = document.getElementById("next-round-button");
    if(nextRoundButton){
      nextRoundButton.style.display = "none";
    }
  } else {
    // After the final round, calculate and display the total score
    submitScore(totalScore).then(() => endGame()); // Submit score and end the game
  }
}

//draws the user guess and actual location
function drawGuess(guessx, guessy, actualx, actualy) {
  //debugging: check if draw guess is succesfully being called
  //console.log("succesfully called drawGuess");

  const canvas = document.getElementById("guess-canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
  
  //draws line between guess and actual location 
  ctx.strokeStyle = "grey";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(guessX, guessY);
  ctx.lineTo(actualx, actualy)
  ctx.stroke();

  //guess location
  ctx.fillStyle = "blue";
  ctx.beginPath();
  ctx.arc(guessx, guessy, 5, 0, 2 * Math.PI);
  ctx.fill();

  //actual location
  ctx.fillStyle = "red";
  ctx.beginPath();
  ctx.arc(actualx, actualy, 5, 0, 2 * Math.PI);
  ctx.fill();
}

//dont need to calculate score, send user guess and actual coords to database
function checkGuess() {
  const canvas = document.getElementById("guess-canvas");
  const { x: actualX, y: actualY } = latLngToXY(actualLat, actualLng);
  
  //debug
  //console.log(`coords of real location: ${actualLat}, ${actualLng}`);
  //console.log(`xy of real location: ${actualX}, ${actualY}`);
  //console.log(`xy of guess: ${guessX}, ${guessY}`);

  drawGuess(guessX, guessY, actualX, actualY);
  
  canvas.style.pointerEvents = "none";

  const score = calculate_score(actualX, actualY, guessX, guessY); 
  totalScore += score; // Add the score to the total score

  document.getElementById("score").innerText = `Score: ${score} points`;
}

//make sure everything is laoded 
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM loaded");

  if (window.location.pathname === "/guesser") {
    startGame();
  }
});

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
    }else if (result.message === "exceed") {
      alert(`Username cannot exceed 20 characters!`);
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
}

async function deleteProfile() {
  const confirmed = window.confirm('Are you sure you want to delete your account. This action can not be undone.')
  if(confirmed){
    const response = await fetch('/delete', {method: "POST"})
    
      if(response.redirected){
        window.location.href = response.url;
      }
  }
}

function openDeletePopup() {
  document.getElementById("delete-popup").style.display = "flex";
}

function closeDeletePopup() {
  document.getElementById("delete-popup").style.display = "none";
}


async function updateProfile() {
  const username = document.getElementById('newUsername');
  const password = document.getElementById('newPassword');
  const confirmPassword = document.getElementById('confirmPassword');
  const oldUsernameElement = document.getElementById('oldUsername'); 

  if (!username || !password || !confirmPassword || !oldUsernameElement) {
      console.error("Required form fields not found.");
      alert("Please fill out all fields.");
      return;
  }

  const usernameValue = username.value.trim();
  const passwordValue = password.value.trim();
  const confirmPasswordValue = confirmPassword.value.trim();
  const oldUsernameValue = oldUsernameElement.value.trim();

  if (usernameValue.length > 20) {
    alert("Username cannot exceed 20 characters.");
    return;
  }

  if (passwordValue !== confirmPasswordValue) {
      console.error("Passwords do not match!");
      alert("Passwords do not match!");
      return;
  }

  const requestData = {
      oldUsername: oldUsernameValue,
      newUsername: usernameValue,
      newPassword: passwordValue,
      confirmPassword: confirmPasswordValue
  };


  try {
      const response = await fetch("/updateProfile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestData)
      });

      if (response.ok) {
          
          if (response.redirected) {
            closeEditPopup();
            window.location.href = response.url

          } else {
            console.error("Update failed:", result.message);
            alert(result.message || "Failed to update user details.");
            window.location.href = response.url

          }
      } else {
          console.error("Server error:", response.status);
          alert("Failed to update user details. Please try again.");
      }
  } catch (error) {
      console.error(error);
      alert("An error occurred while updating user details.");
  }
}

function openEditPopup() {
  document.getElementById("edit-popup").style.display = "flex";
}

function closeEditPopup() {
  document.getElementById("edit-popup").style.display = "none";
}

module.exports = {
  goToPage,
  showMap,
  latLngToXY,
  getRandomStreetViewEmbedLink,
  startGame,
  endGame
}

