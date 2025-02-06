//requires
const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const dbFunctions = require('./db'); //database i/o functions
const jwt = require('jsonwebtoken')
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
app.use(express.static('public'))

app.use((req, res, next) => {
    //cookies of username
    res.locals.loggedIn = !!req.cookies.username;
    res.locals.username = req.cookies.username;
    next();
});

app.get('/', (req, res) => {
  // Render home //
  res.status(200).sendFile(__dirname+'/public/html_files/Home.html')
  // res.status(200).render("homePage", { isHomePage: true });
})

app.get('/login', (req, res) =>{
    //render Login
    res.status(200).sendFile(__dirname+'/public/html_files/Login.html')
    // res.status(200).render("login");
})

app.post('/login', async function(req, res){
    const { username, password } = req.body; //gets username and password from body
    
    try {
      const verification = await dbFunctions.check_cred(username, password)
    
          if (verification === true) {

            const token = jwt.sign({username}, 'secretKey')
            res.cookie('token', token, {httpOnly: true, secure: true }); //cookie for username

            // res.render('homePage', { loggedIn: true, username: username }); //goes back to homePage after login
            console.log('success')
            res.send('success')
          }else{
            //failed verification
            // res.render('login', { error: 'Username or password are incorrect'});
            console.log('failed')
            res.send('failed')
          }
    
        } catch (error) {
          console.error( error);
          res.status(500).send('error');
        }
});

app.get('/profile',  async (req, res) => {
  const token = req.cookies.token

  if(token){
    try{

      const decoded = jwt.verify(token, 'secretKey')
      const username = decoded.username

      const profile = await dbFunctions.get_user(username)
      console.log(profile)
      res.send(profile)

    }catch(error){
      res.status(404).send('invalid token')
    }
  }else{
      res.status(401).send('no token provided')
  }
})

app.post('/getLocation', async function(req, res){
  try{
    const num = req.body

    if(num > await dbFunctions.get_num_locations()){
      res.send("Bounds error")
    }
    const location = await dbFunctions.get_location_by_number(num)

    res.json(location)
  }catch(error){
    console.error(error)
  }
})

app.listen(port, function (err) {
  if (err) {
    throw err
  }
  console.log("== Server listening on port", port) //errors
})

