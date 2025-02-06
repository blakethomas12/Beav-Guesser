// Functions here are used by the html files to perform actions - Gavin Fifer
function goToPage(html_path) {
    window.location.href = "../html_files/"+html_path;
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
    )}!2d${randomLng.toFixed(
      6
    )}!3f0!4f0!5f0.7820865974627469`;
  
    return embedLink;
  }

  function loadRandomStreetView() {
    const iframe = document.getElementById("streetViewFrame");
    const randomLink = getRandomStreetViewEmbedLink();
    iframe.src = randomLink;
  }

  document.addEventListener('DOMContentLoaded', function() {
    var login_form = document.getElementById("login-form").addEventListener('submit', function(event) {
      event.preventDefault();
      login()
    });
    update_buttons()
  });

  async function login() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    console.log('Sending:', username, password);
    
    const data = `{"username": ${username}, "password": ${password}}`;

    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "username": username, "password": password })
      });
  
      const result = await response.text();
      console.log('Server response:', result);
  
      if (result === 'success') {
        // Handle successful login
        update_buttons()
      } else {
        // Handle failed login
      }
    } catch (error) {
      console.error('Error logging in:', error);
    }
  }

  function update_buttons(){
    fetch('/profile')
    .then(response => response.json())
    .then(data => {
      console.log("data:",data)
    })
  }