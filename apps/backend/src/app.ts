
import express from "express";
import cors from "cors";
import inventoryTransactionRoutes from "./modules/inventory/routes/inventory-transaction.routes.js";

import { prisma } from "./config/database.js";
import { errorMiddleware } from "./middleware/error.middleware.js";
import { notFoundMiddleware } from "./middleware/not-found.middleware.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/v1/inventory/transactions", inventoryTransactionRoutes);

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

app.use(notFoundMiddleware);

app.use(errorMiddleware);

export default app;
