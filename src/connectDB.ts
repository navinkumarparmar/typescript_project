import mongoose from 'mongoose';
import dotenv from 'dotenv';
const nodemailer = require('nodemailer');
dotenv.config();

const URL = process.env.URL as string;
console.log("url",URL)
const connectDB = async (): Promise<void> => {
  try {
    console.log("Connecting to Database...");
    await mongoose.connect(URL);
    console.log('MongoDB connected');
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Database connection error:', error.message);
    } else {
      console.error('An unknown error occurred');
    }
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;