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
// search product 
app.get("/product/search", async (req, res) => {

    const { q } = req.query

    if(!q){
        return res.json({
            message: "Product not found."
        })
    }

    try {
        const product = await Product.find({
            $or: [
                { name: { $regex: q, $options: "i" } },
                { description: { $regex: q, $options: "i" } },
            ]
        });

        res.json({
            message: "Search result fetched successfully.",
            data: product
        })
    } catch {
        res.status(500).json({
            message: "An error occured while searching for product."
        })
    } 
})


// get all product 
app.get('/product', async (req, res) => {
    const products = await Product.find()
    res.json({
        message: "Product fetched successfully.",
        data: products
    })
})

// get product by id 
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

// update product  
app.patch("/product/:id", async (req, res) => {

    const { id } = req.params
    const { name, description, price, image } = req.body;

    await Product.findByIdAndUpdate(id, { name, description, price, image })

    res.json({
        message: "Product updated successfully!"
    })
})

// delete product by id 
app.delete('/product/:id', async (req, res) => {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.json({
        message: "Product deleted successfully!"
    })
})


// create product 
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
