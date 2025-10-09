require('dotenv').config()
const express = require('express');
const connectDatabase = require('./database');
const Product = require('./model/productModel');
const multer = require('multer');
const { storage } = require('./middleware/multerConfig');

const app = express();

app.use(express.json());

connectDatabase();

// for file uploading 
const upload = multer({ storage: storage  })


// crud => create read update delete 
app.get( '/product', async (req,res)=> { 
    const products = await Product.find()
    res.json({
        message: "Product fetched successfully.",
        data: products
    })
})

app.post('/product', upload.single('image'), async (req, res)=> {
    console.log(req.body)
    console.log(req.file)
    const { name, price, description, image } = req.body

    const filename = req.file.filename
    console.log("this is filename:", filename)

    const product = await Product.create({name, price, description, image: filename})

    res.status(201).json({
        message: "Product created successfully!",
        data: product
    })
})


app.listen(process.env.PORT, ()=> {
    console.log("Server started!")
})
