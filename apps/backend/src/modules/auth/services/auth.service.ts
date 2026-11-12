import * as authRepository from "../repositories/auth.repository.js";
import { hashPassword } from "./password.service.js";
import type { RegisterInput } from "../schemas/auth.schema.js";
import type { LoginInput } from "../schemas/auth.schema.js";
import { verifyPassword } from "./password.service.js";
import { signAccessToken } from "../../../config/jwt.js";
import { createRefreshToken } from "../refresh-token.service.js";

export class EmailAlreadyRegisteredError extends Error {
  constructor() {
    super("Email is already registered");
    this.name = "EmailAlreadyRegisteredError";
  }
}

const isUniqueConstraintError = (error: unknown): boolean => {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "P2002"
  );
};

export const registerUser = async (input: RegisterInput) => {
  const existingUser = await authRepository.findUserByEmail(input.email);

  if (existingUser) {
    throw new EmailAlreadyRegisteredError();
  }

  const passwordHash = await hashPassword(input.password);

  try {
    const user = await authRepository.createUser(
      input.email,
      passwordHash
    );

    return {
      id: user.id,
      email: user.email
    };
  } catch (error) {
    // Menangani kemungkinan dua request mendaftarkan email
    // yang sama secara bersamaan.
    if (isUniqueConstraintError(error)) {
      throw new EmailAlreadyRegisteredError();
    }

    throw error;
  }
};

export class InvalidCredentialsError extends Error {
  constructor() {
    super("Invalid email or password");
    this.name = "InvalidCredentialsError";
  }
}

export const loginUser = async (input: LoginInput) => {
  const user = await authRepository.findUserByEmail(input.email);

  if (!user || !user.isActive) {
    throw new InvalidCredentialsError();
  }

  const isPasswordValid = await verifyPassword(
    input.password,
    user.passwordHash
  );

  if (!isPasswordValid) {
    throw new InvalidCredentialsError();
  }

  const accessToken = signAccessToken(user.id);
  const refreshToken = await createRefreshToken(user.id);

  return {
    user: {
      id: user.id,
      email: user.email
    },
    accessToken,
    refreshToken: refreshToken.token,
    refreshTokenExpiresAt: refreshToken.expiresAt
  };
};