// ── CLI Runner ───────────────────────────────────────────

import dotenv from "dotenv";
import mongoose from "mongoose";
import { seedUsers } from "./users.seeder.js";
import { seedMenu } from "./menu.seeder.js";
dotenv.config(); // loads .env file

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/restaurant_db";

mongoose
  .connect(MONGO_URI)
  .then(async () => {
    console.log("🔌 Connected to MongoDB");
    await seedUsers();
    await seedMenu();
    await mongoose.disconnect();
    console.log("👋 Disconnected");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Connection failed:", err);
    process.exit(1);
  });
