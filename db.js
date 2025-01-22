import mongoose from 'mongoose'

mongoose.connect('mongodb://localhost:27017/BeavGuesser')

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function(){
    console.log('Connected to MongoDB')
})

const imageSchema = new mongoose.Schema({
    path: String,
    long: Number,
    lat: Number,
    UserSubmitted: Boolean
})

const Image = mongoose.model('image', imageSchema)


const userSchema = new mongoose.Schema({
    username: String,
    level: Number,
})

const User = mongoose.model('users', userSchema)
