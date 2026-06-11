import { Request, Response, NextFunction } from "express";
import { prisma } from "../config/prisma";
import { hashToken } from "../lib/token";

export const verifyHost = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.headers["x-host-token"] as string;
    if (!token) return next(new Error("No token provided"));

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
