import mongoose from "mongoose";
import dotenv from 'dotenv';

// Access the .env file
dotenv.config();

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

export default connectDB;