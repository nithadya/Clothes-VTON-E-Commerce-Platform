import mongoose from "mongoose";
import productModel from "./models/productModel.js";

// Update this to match your actual database name
const MONGODB_URI = "mongodb+srv://jmdevnath:123456987@cluster0.zkacm.mongodb.net/clothes-vton-db";

// Function to check if a product exists
async function checkProduct(productId) {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");
    
    // List all collections to verify we're looking in the right place
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log("Available collections:", collections.map(c => c.name));
    
    // Check if the specific product exists
    const product = await productModel.findById(productId);
    
    if (product) {
      console.log("Product found:", {
        id: product._id,
        name: product.name,
        hasImages: product.image && product.image.length > 0,
        firstImageUrl: product.image && product.image.length > 0 ? product.image[0] : "None"
      });
    } else {
      console.log("Product not found with ID:", productId);
      
      // Let's find any product to verify the collection has data
      const anyProduct = await productModel.findOne({});
      if (anyProduct) {
        console.log("Sample product from database:", {
          id: anyProduct._id,
          name: anyProduct.name
        });
        console.log("Try using this ID instead:", anyProduct._id);
      } else {
        console.log("No products found in the database at all!");
      }
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await mongoose.connection.close();
    console.log("MongoDB connection closed");
  }
}

// Replace with the product ID you're trying to use
const productIdToCheck = "67cd917980ab4a74d11b7b53";
checkProduct(productIdToCheck);