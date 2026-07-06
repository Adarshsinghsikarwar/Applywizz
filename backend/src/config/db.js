import mongoose from "mongoose";
import { config } from "./env.js";

let isConnected = false;

async function connectDB() {
  if (isConnected) return mongoose.connection;

  mongoose.set("strictQuery", true);

  try {
    await mongoose.connect(config.mongoUri, {
      maxPoolSize: 20,
    });
    isConnected = true;
    console.log(`[db] MongoDB connected: ${mongoose.connection.host}`);
  } catch (err) {
    console.error("[db] MongoDB connection failed:", err.message);
    process.exit(1);
  }

  mongoose.connection.on("disconnected", () => {
    console.warn("[db] MongoDB disconnected");
    isConnected = false;
  });

  return mongoose.connection;
}

export { connectDB };
