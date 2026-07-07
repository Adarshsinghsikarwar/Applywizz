import app from "./app.js";
import { config } from "./config/env.js";
import { connectDB } from "./config/db.js";
import express from "express";

connectDB();

app.listen(config.port, () => {
  console.log(`[server] Server running on port ${config.port}`);
});
