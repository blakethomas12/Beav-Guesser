import mongoose from 'mongoose'
import fs from 'fs/promises'
import bcrypt from 'bcrypt'

mongoose.connect('mongodb+srv://thomblak:Q8w8rOO3EisNKGTA@beavguesser.q3c0f.mongodb.net/?retryWrites=true&w=majority&appName=BeavGuesser')

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function(){
    console.log('Connected to MongoDB')
})

const locationSchema = new mongoose.Schema({
    path: String,
    long: Number,
    lat: Number
})

const Location = mongoose.model('location', locationSchema)


const userSchema = new mongoose.Schema({
    username: String,
    password: String
})

const User = mongoose.model('users', userSchema)


//calling this functin returns the total number of locations
async function get_num_locations() {
    const count = await Location.countDocuments()
    return count
}

//provide number for which document to grab
async function get_location_by_number(num) {
    try{
        const num_locations = await get_num_locations()

        if(num < 0 || num >=num_locations) return null

        const doc = await Location.findOne().skip(num).exec()
        return doc
    } catch(error){
            console.error('error retrieving document: (check bounds)', error)
            throw error
    }
}

async function create_user(username, password) {
    try{
        const saltRounds = 10
        const hashedPassword = await bcrypt.hash(password, saltRounds)

        const user = new User({
            username: username,
            password: hashedPassword
        })

        await user.save()
        console.log(`password and username stored for ${username}`)
    }catch(error){
        console.error('Error creating and storing user', error)
    }
}



//==============================IMPORTING FUNCTION=========================================
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
    const data = await fs.readFile(filename, 'utf-8');
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
          console.error('Error saving location:', err);
        }
      } else {
        console.log("Coordinates not found in the link");
      }
    }
}  
  
  // Call the main function with the filename
  //processFile('links.txt');