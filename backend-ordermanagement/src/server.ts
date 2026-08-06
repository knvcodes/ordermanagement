import dotenv from "dotenv";
import cookieParser from "cookie-parser";

// integrate env
dotenv.config();

import express, { Request, Response } from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import logger from "./utils/logger.js";
import router from "./routes.js";
import { globalErrorHandler } from "./utils/errors.js";

const PORT = 3000;
const app = express();

// Enable CORS
app.use(
  cors({
    origin: [
      "http://localhost:3001",
      "http://localhost:5173",
      "http://localhost:4173",
      "http://127.0.0.1:3001",
      process.env.PROD_FRONTEND_URL!,
    ],
    credentials: true, // optional if you send cookies or auth headers
  }),
);

app.use(cookieParser());

// Middleware to parse JSON
app.use(express.json());

// STARTUP
(async () => {
  try {
    // Log env inside async block

    // Connect MongoDB
    await connectDB();

    // Routes
    app.get("/", (_req: Request, res: Response) => {
      res.send("Hello from Express!");
    });

    app.use("/api", router);

    // Global error handler
    app.use(globalErrorHandler);

    // Start server
    app.listen(PORT, () => {
      logger.info(`Server running on http://localhost:${PORT}`);
    });
  } catch (err: any) {
    console.error("✗ Startup failed:", err.message);
    console.error("Stack:", err.stack);
    process.exit(1);
  }
})();
