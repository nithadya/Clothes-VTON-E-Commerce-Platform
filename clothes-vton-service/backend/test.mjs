// app.js
import express from "express";
import multer from "multer";
import fs from "fs/promises";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// MongoDB connection setup
const connectDB = async () => {
  try {
    mongoose.connection.on('connected', () => {
      console.log("MongoDB is connected");
    });
    
    mongoose.connection.on('error', (err) => {
      console.error(`MongoDB connection error: ${err}`);
    });
    
    await mongoose.connect(`${process.env.MONGODB_URI}/e-commerce`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

// Product Model
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: Array, required: true },
  category: { type: String, required: true },
  subCategory: { type: String, required: true },
  bestseller: { type: Boolean, default: false },
  sizes: { type: [String], default: [] },
  date: { type: Date, default: Date.now },
});

const Product = mongoose.models.product || mongoose.model("product", productSchema);

// Initialize Express app
const app = express();
const PORT = 5050;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Multer for handling file uploads
const upload = multer({ dest: "uploads/" });

// Route to get product by ID - integrated directly
app.get("/api/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    
    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

// Route to get all products
app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// Route to handle virtual try-on with product ID
app.post("/api/tryon/:productId", upload.single("personImage"), async (req, res) => {
  try {
    const { productId } = req.params;
    
    // Fetch product from database
    const product = await Product.findById(productId);
    if (!product || !product.image || !product.image.length) {
      return res.status(404).json({ error: "Product or product image not found" });
    }
    
    // Get the first image from the product's image array
    const garmentImageUrl = product.image[0];
    
    // Extract uploaded person image
    const personImagePath = req.file.path;
    const personImage = await fs.readFile(personImagePath);
    
    // Fetch the garment image from the URL
    const response = await fetch(garmentImageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch garment image: ${response.statusText}`);
    }
    const garmentImageBuffer = await response.arrayBuffer();
    const garmentImage = Buffer.from(garmentImageBuffer);
    
    // Dynamically import the Gradio client
    const { client } = await import("@gradio/client");
    
    // Initialize Gradio client - use the client function directly
    const appClient = await client("paroksh-mason/Virtual-Try-On");
    
    // Call the /tryon endpoint
    const result = await appClient.predict("/tryon", [
      personImage,
      garmentImage,
      "Hello!!",
      null,
      true,
      true,
      20,
      20,
    ]);
    
    // Extract URLs from the API response
    const [outputImageObj, maskedImageObj] = result.data;
    
    // Ensure the objects have valid `url` properties
    const outputImageUrl = outputImageObj?.url;
    const maskedImageUrl = maskedImageObj?.url;
    
    if (!outputImageUrl || typeof outputImageUrl !== "string") {
      throw new Error("Invalid or missing URL for output image");
    }
    
    if (!maskedImageUrl || typeof maskedImageUrl !== "string") {
      throw new Error("Invalid or missing URL for masked image");
    }
    
    // Return the URLs to the frontend
    res.json({
      outputImageUrl,
      maskedImageUrl,
      productDetails: {
        name: product.name,
        image: product.image[0],
        price: product.price
      }
    });
    
    // Clean up uploaded file
    await fs.unlink(personImagePath);
  } catch (error) {
    console.error("Error processing virtual try-on:", error);
    res.status(500).json({ error: "Failed to process virtual try-on", details: error.message });
  }
});

// Add a new product
app.post("/api/products", async (req, res) => {
  try {
    const product = new Product(req.body);
    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: "Failed to create product" });
  }
});

// Update a product
app.put("/api/products/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    
    res.status(200).json(product);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Failed to update product" });
  }
});

// Delete a product
app.delete("/api/products/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    
    res.status(200).json({ message: "Product removed" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Failed to delete product" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});