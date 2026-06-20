import { Request, Response, NextFunction } from "express";
import { CreatePlayerSchema, SessionCodeParamSchema } from "../zod-schema";
import { createSession, deleteSession } from "../services/session";

/**
 * Starts a new session with the given host name.
 *
 * @route POST /sessions
 * @param req.body - { name: string } - the host's player name
 * @returns 201 with the created session and host player
 * @throws Passes validation or service errors to the error handler
 */
export const startSession = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const hostName = CreatePlayerSchema.safeParse(req.body);
  if (hostName.success) {
    try {
      const session = await createSession(hostName.data);

      return res.status(201).json(session);
    } catch (error) {
      next(error);
    }
  } else {
    const errorMessage = hostName.error.issues[0]?.message || "Invalid input";
    next(new Error(errorMessage));
  }
};

/**
 * Ends a session by code, deleting it along with all associated data.
 *
 * @route DELETE /sessions/delete/:sessionCode
 * @param req.params - { sessionCode: number } - the session's code
 * @returns 200 with a confirmation message
 * @throws Passes validation or service errors to the error handler
 */
export const endSession = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const sessionCode = SessionCodeParamSchema.safeParse(req.params);
  if (sessionCode.success) {
    try {
      const session = await deleteSession(sessionCode.data);
      return res.status(200).json(session);
    } catch (error) {
      next(error);
    }
  } else {
    const errorMessage =
      sessionCode.error.issues[0]?.message || "Invalid session code";
    next(new Error(errorMessage));
  }
};
