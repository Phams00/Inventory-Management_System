
import {
  randomBytes,
  scrypt,
  timingSafeEqual
} from "node:crypto";

const KEY_LENGTH = 64;
const SALT_LENGTH = 16;

const SCRYPT_OPTIONS = {
  N: 1 << 17,
  r: 8,
  p: 1,
  maxmem: 256 * 1024 * 1024
};

const deriveKey = (password: string, salt: Buffer): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    scrypt(password, salt, KEY_LENGTH, SCRYPT_OPTIONS, (error, key) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(key);
    });
  });
};

export const hashPassword = async (password: string): Promise<string> => {
  const salt = randomBytes(SALT_LENGTH);
  const hash = await deriveKey(password, salt);

  return `scrypt$${salt.toString("hex")}$${hash.toString("hex")}`;
};

export const verifyPassword = async (
  password: string,
  passwordHash: string
): Promise<boolean> => {
  const parts = passwordHash.split("$");

  if (parts.length !== 3 || parts[0] !== "scrypt") {
    return false;
  }

  const saltHex = parts[1];
  const hashHex = parts[2];

  if (
    !/^[a-f0-9]{32}$/i.test(saltHex) ||
    !/^[a-f0-9]{128}$/i.test(hashHex)
  ) {
    return false;
  }

  const salt = Buffer.from(saltHex, "hex");
  const storedHash = Buffer.from(hashHex, "hex");

  const derivedHash = await deriveKey(password, salt);

  return timingSafeEqual(storedHash, derivedHash);
};
