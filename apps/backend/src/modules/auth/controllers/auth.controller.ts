import type { Request, Response, NextFunction } from "express";

import { signAccessToken } from "../../../config/jwt.js";

import { registerSchema, loginSchema } from "../schemas/auth.schema.js";

import {
  registerUser,
  loginUser,
  EmailAlreadyRegisteredError,
  InvalidCredentialsError
} from "../services/auth.service.js";

import {
  rotateRefreshToken,
  revokeRefreshToken
} from "../refresh-token.service.js";
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = registerSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validation.error.flatten().fieldErrors
      });
    }

    const user = await registerUser(validation.data);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user
    });
  } catch (error) {
    if (error instanceof EmailAlreadyRegisteredError) {
      return res.status(409).json({
        success: false,
        message: error.message
      });
    }

    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = loginSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validation.error.flatten().fieldErrors
      });
    }

    const result = await loginUser(validation.data);

    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/api/v1/auth",
      expires: result.refreshTokenExpiresAt
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: result.user,
        accessToken: result.accessToken
      }
    });
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return res.status(401).json({
        success: false,
        message: error.message
      });
    }

    next(error);
  }
};


export const refresh = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    // Pastikan refresh token tersedia
    if (typeof refreshToken !== "string" || !refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token is required"
      });
    }

    // Rotasi refresh token
    const result = await rotateRefreshToken(refreshToken);

    // Buat access token baru
    const accessToken = signAccessToken(result.userId);

    // Simpan refresh token baru ke HttpOnly cookie
    res.cookie("refreshToken", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/api/v1/auth",
      expires: result.expiresAt
    });

    return res.status(200).json({
      success: true,
      message: "Token refreshed successfully",
      data: {
        accessToken
      }
    });
  } catch (error) {
    // Tangani refresh token yang tidak valid, kedaluwarsa,
    // atau sudah pernah digunakan
    if (
      error instanceof Error &&
      (
        error.message === "Invalid refresh token" ||
        error.message === "Invalid or already used refresh token"
      )
    ) {
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/api/v1/auth"
      });

      return res.status(401).json({
        success: false,
        message: "Invalid or expired refresh token"
      });
    }

    // Teruskan error yang tidak terduga ke error middleware
    return next(error);
  }
};


export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (typeof refreshToken === "string" && refreshToken) {
      await revokeRefreshToken(refreshToken);
    }

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/api/v1/auth"
    });

    return res.status(200).json({
      success: true,
      message: "Logout successful"
    });
  } catch (error) {
    next(error);
  }
};