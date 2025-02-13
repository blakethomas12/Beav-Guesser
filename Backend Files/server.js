//requires
const express = require("express");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const dbFunctions = require("./db"); //database i/o functions
const scoreFunctions = require("./scoring") //score function
const jwt = require("jsonwebtoken");
//parsers for code
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const port = 4000;
const app = express();

//connect to MongoDB
mongoose.connect(
  "mongodb+srv://thomblak:Q8w8rOO3EisNKGTA@beavguesser.q3c0f.mongodb.net/?retryWrites=true&w=majority&appName=BeavGuesser"
);

//print message when connection is established
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Connected to MongoDB");
});

app.engine("handlebars", exphbs.engine({ defaultLayout: "main" })); //default look on every site
app.set("view engine", "handlebars");

app.use(express.static("public")); // for styling
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static("public"));

//checks if user is logged in whenever a request is sen to the server
app.use((req, res, next) => {
  const token = req.cookies.token;
  if (token) {
    try {
      const decoded = jwt.verify(token, "secretKey");
      res.locals.isLoggedIn = true;
      res.locals.username = decoded.username;
    } catch (err) {
      res.locals.isLoggedIn = false;
    }
  } else {
    res.locals.isLoggedIn = false;
  }
  next();
});

// Render home
app.get("/", (req, res) => {
  res.status(200).render("home", { isHomePage: true });
});

//render Login
app.get("/login", (req, res) => {
  //if user is logged in no need for login page route to profile page
  if(res.locals.isLoggedIn){
    res.redirect("/profile")
  }else{
    res.status(200).render("login");
  }
});

//render about
app.get("/about", (req, res) => {
  res.status(200).render("about");
});

//render game page
app.get("/guesser", (req, res) => {
  res.status(200).render("guesser");
});

//render leaderboard page
app.get("/leaderboard", async (req, res) => {
  try {
    //get leaderboard information from DB
    const leaderboard = await dbFunctions.calculate_total_scores();
    //render page with data
    res.status(200).render("leaderboard", { leaderboard });
  } catch (error) {
    console.error("Error rendering leaderboard:", error);
    res.status(500).send("Error loading leaderboard");
  }
});

//render profile
app.get("/profile", async (req, res) => {
  if(res.locals.isLoggedIn){
    //get user information
    const username = res.locals.username
    const user = await dbFunctions.get_user(username)
    const level = Math.round(user.xp/50000)

    //render page with the users information
    res.status(200).render("profile", {
      username: username,
      high_score: user.high_score,
      level: level
    });
  }else{
    //if user is not logged in route to login page
    res.redirect('/login')
  }
    
});

//render sign up
app.get("/signup", (req, res) => {
  //if user is signed in route to profile page
  if(res.locals.isLoggedIn){
    res.redirect("/profile")
  }else{
    res.status(200).render("signup");
  }
});

//logins user in by create a cookie for the user
app.post("/loginUser", async function (req, res) {
  const { username, password, staySignedIn } = req.body; //gets username and password from body

  try {
    //checks if username and password match
    const verification = await dbFunctions.check_cred(username, password);

    //if user passes verification create cookie for user
    if (verification === true) {
      const token = jwt.sign({ username }, "secretKey"); //creates token

      //sends cookie to user
      res.cookie("token", token, { 
        httpOnly: true, 
        secure: true,
        maxAge: staySignedIn ? 30*24*60*60*1000 : 1800000 //30 days if stay signed in, or 30 mins if not
      });

      //sends to profile once signed in
      res.redirect("/profile");
    } else {
      //sends message to front saying username or password did not match
      res.json({message: "fail"})
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("error");
  }
});

//logs user out
app.post("/logout", (req, res) => {
  //removes cookie from user
  res.clearCookie("token", { httpOnly: true, secure: true });
  //sends to home page once signed out
  res.redirect("/");
});

//creates a new user
app.post('/register', async (req, res) => {
  //gets info from request
  const { username, password } = req.body
  //checks if username is available
  const name_avail = await dbFunctions.check_name_availability(username)
  try{
    if(name_avail){
      //creates user file
      await dbFunctions.create_user(username, password)
      //sends success message
      res.json({message: "success"})
    } else{
      //sends message saying username is taken
      res.json({message: "taken"})
    }
  } catch(error){
    res.json({message: "fail"})
  }
})

//returns location file of the index provided
app.post("/getLocation", async function (req, res) {
  try {
    //gets num
    const num = req.body;

    //checks if num is within the number of locations in DB
    if (num > (await dbFunctions.get_num_locations())) {
      res.send("Bounds error");
    }
    //gets location from DB
    const location = await dbFunctions.get_location_by_number(num);

    //sends file to front
    res.json(location);
  } catch (error) {
    console.error(error);
  }
});

//updates leaderboard with final score
app.post("/submitScore", async (req, res) => {
  //get score
  const { score } = req.body;
  
  //checks if the user is logged in
  if (res.locals.isLoggedIn) {
    const username = res.locals.username;
    try {
        //updates leaderboard
        await dbFunctions.update_leaderboard(username, score)
        res.json({ message: "success" });
    } catch (error) {
      console.error(error);
      res.json({ message: "error" });
    }
  } else {
    res.json({ message: "not logged in" });
  }
});

//calcs the score of a single round
app.post('/calcScore', (req, res) => {
  //gets users guess and location of image
  const {trueLat, trueLong, userLat, userLong} = req.body
  
  //calcs score
  const score = scoreFunctions.calculate_score(trueLat, trueLong, userLat, userLong)
  //returns score
  res.json({score: score})
})

//catch all page for errors
app.get('*', (req, res) => {
  res.status(404).render('404')
})

app.listen(port, function (err) {
  if (err) {
    throw err;
  }
  console.log("== Server listening on port", port); //errors
});
