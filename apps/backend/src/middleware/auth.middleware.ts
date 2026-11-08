import type { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../config/jwt.js";
import { prisma } from "../config/database.js";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1. Ambil token dari Authorization header
    const authorization = req.headers.authorization;

    if (!authorization?.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication token is required"
      });
    }

    const token = authorization.slice(7);

    // 2. Verifikasi token
    const payload = verifyAccessToken(token);

    // 3. Pastikan token memiliki subject berupa user ID
    if (
      typeof payload === "string" ||
      typeof payload.sub !== "string"
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token"
      });
    }

    // 4. Periksa apakah akun masih aktif
    const user = await prisma.user.findUnique({
      where: {
        id: payload.sub
      },
      select: {
        id: true,
        isActive: true
      }
    });

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: "User account is inactive or not found"
      });
    }

    // 5. Simpan identitas pengguna
    req.userId = user.id;

    next();
  } catch (error) {
    if (
      error instanceof Error &&
      ["TokenExpiredError", "JsonWebTokenError", "NotBeforeError"].includes(error.name)
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired authentication token"
      });
    }

    next(error);
  }
};