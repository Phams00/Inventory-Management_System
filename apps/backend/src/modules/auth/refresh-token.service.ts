
import { randomBytes, createHash } from "node:crypto";
import * as authRepository from "./repositories/auth.repository.js";

const REFRESH_TOKEN_TTL = 7 * 24 * 60 * 60 * 1000;

// ==========================================
// HASH REFRESH TOKEN
// ==========================================

export const hashRefreshToken = (token: string) => {
  return createHash("sha256")
    .update(token)
    .digest("hex");
};

// ==========================================
// GENERATE REFRESH TOKEN
// ==========================================

const generateRefreshToken = () => {
  const token = randomBytes(32).toString("base64url");

  const expiresAt = new Date(
    Date.now() + REFRESH_TOKEN_TTL
  );

  return {
    token,
    tokenHash: hashRefreshToken(token),
    expiresAt
  };
};

// ==========================================
// CREATE REFRESH TOKEN
// ==========================================

export const createRefreshToken = async (userId: string) => {
  const refreshToken = generateRefreshToken();

  await authRepository.createAuthSession(
    userId,
    refreshToken.tokenHash,
    refreshToken.expiresAt
  );

  return {
    token: refreshToken.token,
    expiresAt: refreshToken.expiresAt
  };
};

// ==========================================
// ROTATE REFRESH TOKEN
// ==========================================

export const rotateRefreshToken = async (token: string) => {
  const tokenHash = hashRefreshToken(token);

  const session =
    await authRepository.findAuthSessionByTokenHash(tokenHash);

  if (
    !session ||
    session.revokedAt ||
    session.expiresAt <= new Date()
  ) {
    throw new Error("Invalid refresh token");
  }

  const newRefreshToken = generateRefreshToken();

  await authRepository.rotateAuthSession(
    session.id,
    session.userId,
    newRefreshToken.tokenHash,
    newRefreshToken.expiresAt
  );

  return {
    userId: session.userId,
    token: newRefreshToken.token,
    expiresAt: newRefreshToken.expiresAt
  };
};

// ==========================================
// REVOKE REFRESH TOKEN (LOGOUT)
// ==========================================

export const revokeRefreshToken = async (token: string) => {
  const tokenHash = hashRefreshToken(token);

  const session =
    await authRepository.findAuthSessionByTokenHash(tokenHash);

  if (!session || session.revokedAt) {
    return;
  }

  await authRepository.revokeAuthSession(session.id);
};
