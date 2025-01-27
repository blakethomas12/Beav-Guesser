import mongoose from 'mongoose'

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
    password: String,
    level: Number,
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