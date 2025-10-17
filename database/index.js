
const mongoose = require('mongoose');

async function connectDatabase() {
   await mongoose.connect(process.env.DATABASE_URL)
   console.log("Databse connected")
}

module.exports = connectDatabase

