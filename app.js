require('dotenv').config()
const express = require('express');
const connectDatabase = require('./database');
const Product = require('./model/productModel');
const multer = require('multer');
const { storage } = require('./middleware/multerConfig');
const Category = require('./model/categoryModel');
const User = require('./model/userModel');

const app = express();

app.use(express.json());

connectDatabase();

// for file uploading 
const upload = multer({ storage: storage })


// crud => create read update delete 
// search product 
app.get("/product/search", async (req, res) => {

    const { q } = req.query

    if (!q) {
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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 2;
    const sortField = req.query.sortField || 'createdAt';
    const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;


    const skip = (page - 1) * limit;

    const products = await Product.find().skip(skip).limit(limit).sort({ [sortField]: sortOrder });

    const total = await Product.countDocuments()

    res.json({
        message: "Product fetched successfully.",
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
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


// category create 
app.post('/category', upload.single('image'), async (req, res) => {
    const { name, description } = req.body

    const category = await Category.create({ name, description })

    res.status(201).json({
        message: "Category created successfully!",
        data: category
    })
})


// ******** category ********* 
app.get('/category', async (req, res) => {
    const category = await Category.find()
    res.json({
        message: "Category fetched successfully.",
        data: category,
    })
})


// ****** auth ********* 

app.post('/register', async (req, res) => {

    const { name, email, password } = req.body

    try {
        // check if the user already exists
        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ message: "User already exists." })
        }

        //create a new user 
        user = new User({ name, email, password });

        await user.save();

        res.status(201).json({
            message: "User registered successfully.",
            data: user
        })
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message })
    }
})


//login a user 

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check if the password matches
    const isMatch = await user.matchPasword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    } 

    res.status(200).json({
      message: "Login successful", 
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


 
app.listen(process.env.PORT, () => {
    console.log("Server started!")
})
