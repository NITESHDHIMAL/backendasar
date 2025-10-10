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
const upload = multer({ storage: storage })


// crud => create read update delete 
app.get('/product', async (req, res) => {
    const products = await Product.find()
    res.json({
        message: "Product fetched successfully.",
        data: products
    })
})

app.get('/product/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ObjectId format first
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID format.",
            });
        } 

        const singleProduct = await Product.findById(id);

        if (!singleProduct) {
            return res.status(404).json({
                success: false,
                message: "Product not found!",
            });
        }
 
        res.json({
            success: true,
            message: "Product fetched successfully!",
            data: singleProduct,
        });
    } catch (error) {
        // Catch unexpected errors (like DB issues)
        console.error("Error fetching product:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error.",
        });
    }
});




app.delete('/product/:id', async (req, res) => {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.json({
        message: "Product deleted successfully!"
    })
})



app.post('/product', upload.single('image'), async (req, res) => {
    console.log(req.body)
    console.log(req.file)
    const { name, price, description, image } = req.body

    const filename = req.file.filename
    console.log("this is filename:", filename)

    const product = await Product.create({ name, price, description, image: filename })

    res.status(201).json({
        message: "Product created successfully!",
        data: product
    })
})


app.listen(process.env.PORT, () => {
    console.log("Server started!")
})
