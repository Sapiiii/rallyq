import { z } from "zod";
import { SCORING_SYSTEMS } from "./services/game";
import { MatchSide } from "../prisma/generated/prisma/enums";
import { HOST_TOKEN_HEADER } from "./lib/token";

const playerNameSchema = z
  .string()
  .trim()
  .min(1, "Player name is required")
  .max(20, "Player name must be 20 characters or less");

const playerIdSchema = z.number().int().positive();
const scoreSchema = z.number().int().min(0);

const scoringSystemSchema = z.enum(SCORING_SYSTEMS);
const matchSideSchema = z.enum(MatchSide);

const playerAssignmentSchema = z.object({
  playerId: playerIdSchema,
  side: matchSideSchema,
});

export const SessionCodeParamSchema = z.object({
  code: z.coerce.number().int().positive(),
});

export type SessionCodeParam = z.infer<typeof SessionCodeParamSchema>;

export const CreatePlayerSchema = SessionCodeParamSchema.extend({
  name: playerNameSchema,
});

export type CreatePlayer = z.infer<typeof CreatePlayerSchema>;

export const CreateHostPlayerSchema = CreatePlayerSchema.omit({ code: true });

export type CreateHostPlayer = z.infer<typeof CreateHostPlayerSchema>;

export const CreateGameSchema = z.object({
  scoringSystem: scoringSystemSchema,
  teamAScore: scoreSchema,
  teamBScore: scoreSchema,
  players: z.array(playerAssignmentSchema),
});

export type CreateGame = z.infer<typeof CreateGameSchema>;
