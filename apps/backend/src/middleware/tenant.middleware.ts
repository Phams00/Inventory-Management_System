import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { prisma } from "../config/database.js";

export const tenantMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1. Pastikan pengguna sudah terautentikasi
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }

    // 2. Ambil perusahaan yang dipilih dari header
    const companyId = req.get("X-Company-Id");

    if (!companyId) {
      return res.status(400).json({
        success: false,
        message: "X-Company-Id header is required"
      });
    }

    // 3. Validasi format UUID
    const parsedCompanyId = z.string().uuid().safeParse(companyId);

    if (!parsedCompanyId.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid company ID"
      });
    }

    // 4. Periksa membership pengguna
    const membership = await prisma.companyUser.findUnique({
      where: {
        companyId_userId: {
          companyId: parsedCompanyId.data,
          userId: req.userId
        }
      },
      select: {
        status: true
      }
    });

    // 5. Tolak jika membership tidak aktif
    if (!membership || membership.status !== "ACTIVE") {
      return res.status(403).json({
        success: false,
        message: "You do not have access to this company"
      });
    }

    // 6. Simpan tenant context
    req.companyId = parsedCompanyId.data;

    next();
  } catch (error) {
    next(error);
  }
};      