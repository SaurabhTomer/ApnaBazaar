import mongoose from "mongoose";

export const connectDb = async () => {
  try {
    await mongoose.connect(process.env.CART_MONGO_URL);
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection error:", error.message);
    process.exit(1); // stop server if DB fails
  }
};