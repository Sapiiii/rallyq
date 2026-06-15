import { z } from "zod";
import { SCORING_SYSTEMS } from "../services/game";
import { MatchSide } from "../../prisma/generated/prisma/enums";

export const CreateGameSchema = z.object({
  scoringSystem: z.enum(SCORING_SYSTEMS),
  teamAScore: z.number().int().min(0),
  teamBScore: z.number().int().min(0),
  players: z.array(
    z.object({
      playerId: z.number().int(),
      side: z.enum(MatchSide),
    }),
  ),
});

export const PlayerNameInputSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Player name is required")
    .max(20, "Player name must be 20 characters or less"),
});
