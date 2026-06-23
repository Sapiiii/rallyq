import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  PORT: z.coerce.number().default(3000),
  FRONTEND_URL: z.url({ error: "FRONTEND_URL is required" }),
});

export const config = envSchema.parse(process.env);
