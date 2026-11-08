import "dotenv/config";
import jwt from "jsonwebtoken";

const secret = process.env.JWT_ACCESS_SECRET;

if (!secret || Buffer.byteLength(secret, "utf8") < 32) {
  throw new Error("JWT_ACCESS_SECRET must be at least 32 bytes");
}

export const jwtConfig = {
  secret,
  expiresIn: "15m" as const
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, jwtConfig.secret, {
    algorithms: ["HS256"]
  });
};

export const signAccessToken = (userId: string) => {
  return jwt.sign(
    {},
    jwtConfig.secret,
    {
      algorithm: "HS256",
      subject: userId,
      expiresIn: jwtConfig.expiresIn
    }
  );
};