
import { z } from "zod";

const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email("Invalid email address")
  .max(254);

export const registerSchema = z.object({
  email: emailSchema,
  password: z
    .string()
    .min(12, "Password must be at least 12 characters")
    .max(128, "Password is too long")
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z
    .string()
    .min(1, "Password is required")
    .max(128, "Password is too long")
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
