import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error("❌ Error: MONGODB_URI is missing in your .env file!");
    process.exit(1); 
  }

  mongoose.connection.on("connected", () => {
    console.log("🔄 MongoDB connection established successfully.");
  });

  mongoose.connection.on("error", (err) => {
    console.error(`❌ MongoDB connection error: ${err.message}`);
  });

  mongoose.connection.on("disconnected", () => {
    console.warn("⚠️ MongoDB disconnected. Attempting to reconnect...");
  });

  try {
    await mongoose.connect(uri);
    console.log("✨ DB connected and synchronized!");
  } catch (error) {
    console.error("💥 Initial database connection failed:", error.message);
    process.exit(1); // Kill app if it cannot connect at startup
  }
};

