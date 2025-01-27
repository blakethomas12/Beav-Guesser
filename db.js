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
    lat: Number,
    UserSubmitted: Boolean
})

const Location = mongoose.model('location', locationSchema)


const userSchema = new mongoose.Schema({
    username: String,
    level: Number,
})

const User = mongoose.model('users', userSchema)
