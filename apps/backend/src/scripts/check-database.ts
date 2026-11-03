
import { prisma } from "../config/database.js";

async function checkDatabase() {
  try {
    const result = await prisma.$queryRaw`SELECT 1 AS connected`;

    console.log("Database connection successful!");
    console.log("Query result:", result);
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();
