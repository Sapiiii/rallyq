import { Request, Response, NextFunction } from "express";
import { prisma } from "../config/prisma";
import { hashToken, HOST_TOKEN_HEADER } from "../lib/token";

export const verifyHost = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.headers[HOST_TOKEN_HEADER] as string;
    if (typeof token !== "string" || token.length === 0) {
      return next(new Error("No token provided"));
    }

    const hashedToken = hashToken(token);
    const session = await prisma.session.findUnique({
      where: { hostToken: hashedToken },
    });
    if (!session) return next(new Error("Invalid token"));

    next();
  } catch (error) {
    next(error);
  }
};
