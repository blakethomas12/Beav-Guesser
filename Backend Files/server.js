//requires
const express = require("express");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const dbFunctions = require("./db"); //database i/o functions
const jwt = require("jsonwebtoken");
//parsers for code
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const port = 4000;
const app = express();

mongoose.connect(
  "mongodb+srv://thomblak:Q8w8rOO3EisNKGTA@beavguesser.q3c0f.mongodb.net/?retryWrites=true&w=majority&appName=BeavGuesser"
);

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

app.get("/", (req, res) => {
  // Render home //
  res.status(200).render("home", { isHomePage: true });
});

app.get("/login", (req, res) => {
  //render Login
  res.status(200).render("login");
});

app.get("/about", (req, res) => {
  //render about
  res.status(200).render("about");
});

app.get("/guesser", (req, res) => {
  //render game page
  res.status(200).render("guesser");
});

app.get("/leaderboard", (req, res) => {
  //render Leaderboard page
  res.status(200).render("leaderboard");
});

app.get("/profile", async (req, res) => {
  if(res.locals.isLoggedIn){
    const username = res.locals.username
    const user = await dbFunctions.get_user(username)
    const level = Math.round(user.xp/50000)
    //render profile
    res.status(200).render("profile", {
      username: username,
      high_score: user.high_score,
      level: level
    });
  }else{
    res.redirect('/login')
  }
    
});

app.get("/signup", (req, res) => {
  //render sign up
  res.status(200).render("signup");
});

app.post("/login", async function (req, res) {
  const { username, password } = req.body; //gets username and password from body

  try {
    const verification = await dbFunctions.check_cred(username, password);

    if (verification === true) {
      const token = jwt.sign({ username }, "secretKey");
      res.cookie("token", token, { httpOnly: true, secure: true }); //cookie for username
      res.redirect("/");
    } else {
      //failed verification
      // res.render('login', { error: 'Username or password are incorrect'});
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("error");
  }
});

app.post("/logout", (req, res) => {
  res.clearCookie("token", { httpOnly: true, secure: true });
  res.redirect("/");
});

app.post('/register', async (req, res) => {
  const { username, password } = req.body
  console.log(username, password)

  const name_avail = await dbFunctions.check_name_availability(username)
  try{
    if(name_avail){
      await dbFunctions.create_user(username, password)
      res.json({message: "success"})
    } else{
      res.json({message: "taken"})
    }
  } catch(error){
    res.json({message: "fail"})
  }
})

app.post("/getLocation", async function (req, res) {
  try {
    const num = req.body;

    if (num > (await dbFunctions.get_num_locations())) {
      res.send("Bounds error");
    }
    const location = await dbFunctions.get_location_by_number(num);

    res.json(location);
  } catch (error) {
    console.error(error);
  }
});

app.get("/leaderboard", async (req, res) => {
  try {
    const leaderboard = await dbFunctions.calculate_total_scores();
    res.status(200).render("leaderboard", { leaderboard });
  } catch (error) {
    console.error("Error rendering leaderboard:", error);
    res.status(500).send("Error loading leaderboard");
  }
});

app.get('*', (req, res) => {
  res.status(404).render('404')
})

app.listen(port, function (err) {
  if (err) {
    throw err;
  }
  console.log("== Server listening on port", port); //errors
});
