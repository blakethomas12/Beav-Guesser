const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const fs = require('fs/promises');

// mongoose.connect(
//   "mongodb+srv://thomblak:Q8w8rOO3EisNKGTA@beavguesser.q3c0f.mongodb.net/?retryWrites=true&w=majority&appName=BeavGuesser"
// );

// const db = mongoose.connection;
// db.on("error", console.error.bind(console, "connection error:"));
// db.once("open", function () {
//   console.log("Connected to MongoDB");
// });

const locationSchema = new mongoose.Schema({
  path: String,
  long: Number,
  lat: Number,
});

const Location = mongoose.model("location", locationSchema);

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  high_score: Number,
  xp: Number
});

const User = mongoose.model("users", userSchema);

const leaderboardSchema = new mongoose.Schema({
  username: String,
  score: Number,
  timestamp: { type: Date, default: Date.now },
});

const Leaderboard = mongoose.model("leaderboard", leaderboardSchema);

//==========================LOCATION FUNCTIONS===========================================
//calling this function returns the total number of locations
async function get_num_locations() {
  const count = await Location.countDocuments();
  return count;
}

//provide number for which document to grab
async function get_location_by_number(num) {
  try {
    const num_locations = await get_num_locations();

    if (num < 0 || num >= num_locations) return null;

    const doc = await Location.findOne().skip(num).exec();
    return doc;
  } catch (error) {
    console.error("error retrieving document: (check bounds)", error);
    throw error;
  }
}

//========================USER FUNCTIONS=================================================
//creates a user with the given username and password, encrypts password before storing
async function create_user(username, password) {
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = new User({
      username: username,
      password: hashedPassword,
      high_score: 0,
      xp: 0,
    });

    const leaderboard = new Leaderboard({
      username: username,
      score: 0,
    })

    await leaderboard.save()


    await user.save();
    console.log(`password and username stored for ${username}`);
  } catch (error) {
    console.error("Error creating and storing user", error);
  }
}

//checks if the username and password are correct returns true or false
async function check_cred(username, password) {
  try {
    console.log(`Checking credentials for user: ${username}`);
    const user = await User.findOne({ username: username });
    if (!user) {
      console.log(`User not found: ${username}`);
      return false;
    }
    console.log(`User found: ${username}, verifying password...`);
    const match = await bcrypt.compare(password, user.password);
    console.log(`Password match: ${match}`);
    return match;
  } catch (error) {
    console.error("Error checking creds:", error);
    return false;
  }
}

//function returns user
async function get_user(username) {
  try {
    const user = await User.findOne({ username: username });
    if (!user) {
      console.log(`User not found: ${username}`);
      return null;
    }
      const doc  = {
        username: user.username,
        high_score: user.high_score,
        xp: user.high_score
      }
      return doc;

  } catch (error) {
    console.error("Error getting user:", error);
    return null;
  }
}

//checks the availability of a username
async function check_name_availability(name) {
  try {
    const user = await User.findOne({ username: name });
    if (user) {
      return false;
    } else {
      return true;
    }
  } catch (error) {
    console.error("error checking name", error);
    return false;
  }
}

//==============================LEADERBOARD FUNCTIONS===============================================
async function get_top_players() {
  try {
    const topPlayers = await Leaderboard.find().sort({ score: -1 }).limit(10);
    return topPlayers;
  } catch (error) {
    console.error("error getting leaderboard data", error);
    return null;
  }
}

//todo: make so only update if score if greater
async function update_leaderboard(username, score) {
  try {
    const user = await User.findOne({username: username})
    if(user.high_score<=score){
      await Leaderboard.findOneAndUpdate(
        { username: username },
        { score, timestamp: new Date() },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      user.high_score = score
    }
    user.xp = user.xp + calculate_xp(score)
  } catch (error) {
    console.log("error updating leaderboard:", error);
  }
}

function calculate_xp(score){
  const SCORE_TO_XP_RATIO = 12

  return score * SCORE_TO_XP_RATIO
}


module.exports = {
  get_num_locations,
  get_location_by_number,
  create_user,
  check_cred,
  get_user,
  check_name_availability,
  get_top_players,
  update_leaderboard,
};

//==============================IMPORTING FUNCTIONS=========================================
function extractLatLong(url) {
  const regex = /!2m2!1d([0-9.\-]+)!2d([0-9.\-]+)/;
  const match = url.match(regex);
  if (match) {
    const latitude = match[1];
    const longitude = match[2];
    return { latitude, longitude };
  }
  return null;
}

async function saveLocation(link, latitude, longitude) {
  const location = new Location({
    path: link,
    lat: latitude,
    long: longitude,
  });

  await location.save();
  console.log(`Saved location: ${link}`);
}

async function extractLinksFromFile(filename) {
  const data = await fs.readFile(filename, "utf-8");
  const regex = /src="([^"]+)"/g;
  const links = [];
  let match;
  while ((match = regex.exec(data)) !== null) {
    links.push(match[1]);
  }
  return links;
}

async function processFile(filename) {
  const links = await extractLinksFromFile(filename);
  if (!Array.isArray(links) || links.length === 0) {
    console.log("No valid links found in the file.");
    return;
  }
  for (const link of links) {
    const coordinates = extractLatLong(link);
    if (coordinates) {
      try {
        await saveLocation(link, coordinates.latitude, coordinates.longitude);
      } catch (err) {
        console.error("Error saving location:", err);
      }
    } else {
      console.log("Coordinates not found in the link");
    }
  }
}

//processFile('links.txt');
