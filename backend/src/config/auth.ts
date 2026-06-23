import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { config } from "./env";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  session: {
    modelName: "UserSession",
  },
  emailAndPassword: {
    enabled: true,
  },
  trustedOrigins: [config.FRONTEND_URL],
});
