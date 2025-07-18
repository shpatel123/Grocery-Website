import mongoose from "mongoose";

const connectDB = async () => {
mongoose
  .connect("mongodb+srv://bhalalashubham1:<Sidog@29>@greencartcluster.7uv9qge.mongodb.net/greencart")
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
}

export default connectDB;
