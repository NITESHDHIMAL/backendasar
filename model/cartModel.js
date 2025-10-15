const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
    productId: String,
    name: {
        type:String,
        unique: true
    }, 
    quantity: Number,
    price: Number,
})

const Cart = mongoose.model("Cart", CartSchema)

module.exports = Cart;
