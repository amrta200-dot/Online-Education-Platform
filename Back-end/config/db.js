import mongoose from "mongoose";

const connectDB = async () => {
  console.log("Trying to connect to MongoDB...");

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:");
    console.error(error);
    process.exit(1);
  }
};
export default connectDB;