import { createHash, randomBytes } from "crypto";

export const HOST_TOKEN_HEADER = "rallyq-host-token";

export function generateToken(): string {
  return randomBytes(4).toString("hex").toUpperCase();
}

export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}
