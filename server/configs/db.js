import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // Use environment variable for production, fallback for development
    const mongoURI = process.env.MONGODB_URI || 
      "mongodb+srv://bhalalashubham1:Sidog%4029@greencartcluster.7uv9qge.mongodb.net/greencart";
    
    await mongoose.connect(mongoURI);
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Exit the process if connection fails
  }
};

export default connectDB;
