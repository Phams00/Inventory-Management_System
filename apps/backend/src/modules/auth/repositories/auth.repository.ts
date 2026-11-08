import { prisma } from "../../../config/database.js";

// ==========================================
// FIND USER BY EMAIL
// ==========================================

export const findUserByEmail = async (email: string) => {
  return prisma.user.findUnique({
    where: { email }
  });
};

// ==========================================
// FIND USER BY ID
// ==========================================

export const findUserById = async (userId: string) => {
  return prisma.user.findUnique({
    where: { id: userId }
  });
};

// ==========================================
// CREATE USER
// ==========================================

export const createUser = async (
  email: string,
  passwordHash: string
) => {
  return prisma.user.create({
    data: {
      email,
      passwordHash
    }
  });
};

// ==========================================
// CREATE AUTH SESSION
// ==========================================

export const createAuthSession = async (
  userId: string,
  tokenHash: string,
  expiresAt: Date
) => {
  return prisma.authSession.create({
    data: {
      userId,
      tokenHash,
      expiresAt
    }
  });
};

// ==========================================
// FIND AUTH SESSION BY TOKEN HASH
// ==========================================

export const findAuthSessionByTokenHash = async (
  tokenHash: string
) => {
  return prisma.authSession.findUnique({
    where: { tokenHash }
  });
};

// ==========================================
// REVOKE AUTH SESSION
// ==========================================

export const revokeAuthSession = async (
  sessionId: string
) => {
  return prisma.authSession.update({
    where: { id: sessionId },
    data: {
      revokedAt: new Date()
    }
  });
};

// ==========================================
// ROTATE AUTH SESSION ATOMICALLY
// ==========================================

export const rotateAuthSession = async (
  sessionId: string,
  userId: string,
  tokenHash: string,
  expiresAt: Date
) => {
  return prisma.$transaction(async (tx) => {
    const now = new Date();

    // Revoke the old session only if it is still valid
    const result = await tx.authSession.updateMany({
      where: {
        id: sessionId,
        revokedAt: null,
        expiresAt: {
          gt: now
        }
      },
      data: {
        revokedAt: now
      }
    });

    // Only one concurrent request can revoke this session
    if (result.count !== 1) {
      throw new Error("Invalid or already used refresh token");
    }

    // Create the replacement session
    return tx.authSession.create({
      data: {
        userId,
        tokenHash,
        expiresAt
      }
    });
  });
};