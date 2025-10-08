
const mongoose = require('mongoose');

async function connectDatabase() {
   await mongoose.connect(process.env.DATABASE_URL)
}

module.exports = connectDatabase

