import dotenv from "dotenv";

dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL not populated in .env");
}

export const config = {
  DATABASE_URL: process.env.DATABASE_URL,
};
