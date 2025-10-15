const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type:String,
        unique: true
    }, 
    email: String,
    password: String,
    role: String
})

const User = mongoose.model("User", userSchema)

module.exports = User;
