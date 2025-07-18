import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 
      "mongodb+srv://bhalalashubham1:Sidog%4029@greencartcluster.7uv9qge.mongodb.net/greencart";
    
    console.log("Attempting to connect to MongoDB...");
    console.log("MongoDB URI:", mongoURI.replace(/:[^:@]*@/, ':****@')); // Hide password in logs
    
    await mongoose.connect(mongoURI);
    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    console.error("Full error:", err);
    // Don't exit process, let server start anyway for debugging
    // process.exit(1);
  }
};

export default connectDB;
