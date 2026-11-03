
import "dotenv/config";

import app from "./app.js";
import { prisma } from "./config/database.js";

const PORT = Number(process.env.PORT) || 3000;

const server = app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

async function shutdown() {
  console.log("Shutting down server...");

  server.close(async () => {
    await prisma.$disconnect();
    console.log("Database disconnected.");
    process.exit(0);
  });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
