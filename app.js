require('dotenv').config()
const express = require('express');
const connectDatabase = require('./database');
const Product = require('./model/productModel');

const app = express();

app.use(express.json());

connectDatabase();


// crud => create read update delete 
app.get( '/product', async (req,res)=> { 
    const products = await Product.find()
    res.json({
        message: "Product fetched successfully.",
        data: products
    })
})

app.post('/product', (req, res)=> {
    console.log(req.body)
    const { name, price, description, image } = req.body
    Product.create({name, price, description, image})
    res.status(201).json({
        message: "Product created successfully!",
        data: req.body
    })
})


app.listen(process.env.PORT, ()=> {
    console.log("Server started!")
})
