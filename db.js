const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const fs = require('fs/promises');

//location schemes
const locationSchema = new mongoose.Schema({
  path: String,
  long: Number,
  lat: Number,
});
const Location = mongoose.model("location", locationSchema);

//user schemes
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  high_score: Number,
  xp: Number
});
const User = mongoose.model("users", userSchema);

//leaderboard schemes
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
    throw error;
  }
}

//========================USER FUNCTIONS=================================================
//creates a user with the given username and password, encrypts password before storing
async function create_user(username, password) {
  try {
    //hashes password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = new User({
      username: username,
      password: hashedPassword,
      high_score: 0,
      xp: 0,
    });

    //creates leaderboard object for user
    const leaderboard = new Leaderboard({
      username: username,
      score: 0,
    })

    await leaderboard.save()
    await user.save();

  } catch (error) {
    throw error
  }
}

//checks if the username and password are correct returns true or false
async function check_cred(username, password) {
  try {
    // console.log(`Checking credentials for user: ${username}`);
    //checks if username exists
    const user = await User.findOne({ username: username });
    if (!user) {
      console.log(`User not found: ${username}`);
      return false;
    }

    //checks is password matches username
    // console.log(`User found: ${username}, verifying password...`);
    const match = await bcrypt.compare(password, user.password);
    // console.log(`Password match: ${match}`);
    return match;
  } catch (error) {
    return false;
  }
}

//function returns user
async function get_user(username) {
  try {

    //checks if user exists
    const user = await User.findOne({ username: username });
    if (!user) {
      return null;
    }

    //creates object with needed information
      const doc  = {
        username: user.username,
        high_score: user.high_score,
        xp: user.xp
      }

      return doc;

  } catch (error) {
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
    return false;
  }
}

async function delete_user(username) {
  try{
    await User.findOneAndDelete({username: username})
    await Leaderboard.findOneAndDelete({username: username})
  }catch(error){
    throw error
  }
}

async function update_user(oldUsername, newUsername, newPassword) {
  try {
    const user = await User.findOne({ username: oldUsername });
    if (!user) {
      console.error("User not found.");
      return null;
    }
    if (newUsername && newUsername !== oldUsername) {
      const nameAvailable = await check_name_availability(newUsername);
      if (!nameAvailable) {
        console.error("Username already taken.");
        return null;
      }
      user.username = newUsername;
      await Leaderboard.updateMany(
        { username: oldUsername },
        { $set: { username: newUsername } }
      );
    }
    if (newPassword) {
      const saltRounds = 10;
      user.password = await bcrypt.hash(newPassword, saltRounds);
    }

    await user.save();

    // Return the updated user profile
    const updatedDoc = {
      username: user.username,
      high_score: user.high_score,
      xp: user.xp
    };

    return updatedDoc;
  } catch (error) {
    console.error("Error updating user:", error);
    return null;
  }
}

//==============================LEADERBOARD FUNCTIONS===============================================
//currently not used
async function get_top_players() {
  try {
    const topPlayers = await Leaderboard.find().sort({ score: -1 }).limit(10);
    return topPlayers;
  } catch (error) {
    return null;
  }
}

// Function to calculate total scores and return the leaderboard with ranks
async function calculate_total_scores() {
  try {
    // Aggregate scores from the Leaderboard collection
    const leaderboard = await Leaderboard.aggregate([
      {
        $group: {
          _id: "$username",              
          total_score: { $sum: "$score" } // Sum all scores for each user
        }
      },
      {
        $sort: { total_score: -1 }       // Sort by total_score in descending order
      }
    ]);

    // Add rank after sorting
    const formattedLeaderboard = leaderboard.map((user, index) => ({
      rank: index + 1,                   // Add rank based on position
      username: user._id,
      total_score: user.total_score
    }));

    return formattedLeaderboard;
  } catch (error) {
    return [];
  }
}


//updates the users information after a game
async function update_leaderboard(username, score) {
  try {
    //finds and updates leaderboard object with new score
    await Leaderboard.findOneAndUpdate(
      { username: username },
      {
        $inc: { score: score },                // Increment the score
        $set: { timestamp: new Date() }        // Set the timestamp
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );   
    
    //checks if a high score has been achieved
    const user = await User.findOne({username: username});
    if(score >= user.high_score){
      user.high_score = score;
    }

    //adds xp to user file
    user.xp = user.xp + calculate_xp(score);

    // Save the updated user document
    await user.save();
  } catch (error) {
    console.error(error);
  }
}

//calcs xp of a game
function calculate_xp(score){
  const SCORE_TO_XP_RATIO = 12

  return score * SCORE_TO_XP_RATIO
}


//exports the needed functions
module.exports = {
  get_num_locations,
  get_location_by_number,
  create_user,
  check_cred,
  get_user,
  check_name_availability,
  get_top_players,
  update_leaderboard,
  calculate_total_scores,
  delete_user,
  update_user
};
