//requires
const express = require('express');
const exphbs = require('express-handlebars');
const fs = require('fs');
const mongoose = require('mongoose');
const dbFunctions = require('./db');
//parsers for code
const bodyParser = require('body-parser'); 
const cookieParser = require('cookie-parser');

const port = 4000;
const app = express();

mongoose.connect(
  "mongodb+srv://thomblak:Q8w8rOO3EisNKGTA@beavguesser.q3c0f.mongodb.net/?retryWrites=true&w=majority&appName=BeavGuesser"
);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('Connected to MongoDB');
});

app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' })); //default look on every site
app.set('view engine', 'handlebars');

app.use(express.static('public')); // for styling
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());



app.use((req, res, next) => {
    //cookies of username
    res.locals.loggedIn = !!req.cookies.username;
    res.locals.username = req.cookies.username;
    next();
});

app.get('/', (req, res) => {
  // Render home //
  res.status(200).render("homePage", { isHomePage: true });
})

app.get('/login', (req, res) =>{
    //render Login
    res.status(200).render("login");
})

app.post('/login', (req, res) => {
    const { username, password } = req.body; //gets username and password from body
    
    fs.readFile('userData.json', (err, data) => { //reads json file
        if (err) {
          console.error('Error reading userData.json:', err);
          return res.status(500).send('Internal server error');
        }
    
        try {
          const users = JSON.parse(data);
          const user = users[username];
    
          if (!user) {
            // Username does not exist
            return res.render('login', { error: 'Username does not exist'});
          }
    
          if (user.password !== password) {
            // Incorrect password
            return res.render('login', { error2: 'Incorrect password'});
          }
    
       
          res.cookie('username', username, { maxAge: 900000, httpOnly: true }); //cookie for username
          res.render('homePage', { loggedIn: true, username: username }); //goes back to homePage after login
        } catch (error) {
          console.error( error);
          res.status(500).send('error');
        }
      });
});

app.listen(port, function (err) {
  if (err) {
    throw err
  }
  console.log("== Server listening on port", port) //errors
})

