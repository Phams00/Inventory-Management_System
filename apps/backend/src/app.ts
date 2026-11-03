
import express from "express";
import cors from "cors";

import { prisma } from "./config/database.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    res.status(200).json({
      success: true,
      message: "Inventory Management System API is running",
      services: {
        api: "healthy",
        database: "connected"
      }
    });
  } catch {
    res.status(503).json({
      success: false,
      message: "Database connection failed",
      services: {
        api: "healthy",
        database: "unavailable"
      }
    });
  }
});

export default app;
