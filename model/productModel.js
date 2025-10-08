const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type:String,
        unique: true
    }, 
    price: Number,
    description: String,
    image: String
})

const Product = mongoose.model("Product", productSchema)

module.exports = Product;
