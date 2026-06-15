import { prisma } from "../config/prisma";
import { MatchSide } from "../../prisma/generated/prisma/client";
import { CreateGameInput } from "../middlewares/zod-schema";

export const SCORING_SYSTEMS = {
  FIRST_TO_21: "FIRST_TO_21",
  FIRST_TO_15: "FIRST_TO_15",
} as const;

type ObjectValues<T> = T[keyof T];
type ScoringSystem = ObjectValues<typeof SCORING_SYSTEMS>;

/**
 * Creates a new completed game with scores and players.
 * Validates players and scores before persisting to the database.
 *
 * @param sessionId - The ID of the session this game belongs to
 * @param gameData - The validated game input properties (scores, scoring system, and player array)
 * @returns The created game with its players
 * @throws {Error} If player layouts are invalid (e.g., duplicate assignments, uneven teams)
 * @throws {Error} If scores do not satisfy badminton win rules
 * @throws {Error} If one or more players do not exist in this session
 * @throws {Error} If the database operation fails
 */
export const createGame = async (
  sessionId: number,
  gameData: CreateGameInput,
) => {
  const { teamAScore, teamBScore, scoringSystem, players } = gameData;
  validatePlayers(players);
  validateScore(teamAScore, teamBScore, scoringSystem);

  const incomingPlayerIds = players.map((p) => p.playerId);
  const validPlayers = await prisma.player.findMany({
    where: {
      id: { in: incomingPlayerIds },
      sessionId: sessionId,
    },
    select: { id: true },
  });

  if (validPlayers.length !== incomingPlayerIds.length) {
    throw new Error("One or more players do not exist in this session");
  }

  return prisma.game.create({
    data: {
      sessionId,
      teamAScore,
      teamBScore,
      playersInGame: {
        create: players.map((p) => ({
          playerId: p.playerId,
          side: p.side,
        })),
      },
    },
    include: {
      playersInGame: true,
    },
  });
};

/**
 * Retrieves all completed games for a given session.
 *
 * @param sessionId - The ID of the session to retrieve games for
 * @returns An array of games with their players
 * @throws {Error} If the session does not exist
 */
export const getGamesBySession = async (sessionId: number) => {
  return prisma.game.findMany({
    where: { sessionId },
    include: {
      playersInGame: {
        include: { player: true },
      },
    },
  });
};

/**
 * Validates the players in a badminton game.
 * Supports both singles (1v1) and doubles (2v2) formats.
 *
 * @param players - Array of players with their assigned sides
 * @throws {Error} If the same player is assigned to more than one slot
 * @throws {Error} If either side has no players
 * @throws {Error} If both sides don't have equal number of players
 */
function validatePlayers(players: { playerId: number; side: MatchSide }[]) {
  let teamACount = 0;
  let teamBCount = 0;
  const uniquePlayerIds = new Set<number>();
  for (const player of players) {
    if (uniquePlayerIds.has(player.playerId)) {
      throw new Error("A player cannot appear more than once in a game");
    }

    uniquePlayerIds.add(player.playerId);

    if (player.side === MatchSide.TEAM_A) {
      teamACount++;
    } else {
      teamBCount++;
    }
  }

  if (teamACount === 0) throw new Error("Team A must have at least one player");
  if (teamBCount === 0) throw new Error("Team B must have at least one player");
  if (teamACount !== teamBCount)
    throw new Error("Both sides must have equal number of players");
}

/**
 * Validates a badminton score against the given scoring system.
 * Accounts for standard wins and tiebreak scenarios (2 point gap rule).
 * Supports First to 15 (ceiling 21) and First to 21 (ceiling 30) formats.
 *
 * @param teamAScore - The score of team A
 * @param teamBScore - The score of team B
 * @param scoringSystem - The scoring system to validate against
 * @throws {Error} If the winning score is below the target
 * @throws {Error} If the winning score exceeds the ceiling
 * @throws {Error} If the score does not satisfy win conditions
 */
function validateScore(
  teamAScore: number,
  teamBScore: number,
  scoringSystem: ScoringSystem,
) {
  const target = scoringSystem === SCORING_SYSTEMS.FIRST_TO_21 ? 21 : 15;
  const ceiling = scoringSystem === SCORING_SYSTEMS.FIRST_TO_21 ? 30 : 21;
  const winner = Math.max(teamAScore, teamBScore);
  const loser = Math.min(teamAScore, teamBScore);

  if (winner < target) throw new Error("Winning score too low");
  if (winner > ceiling) throw new Error("Winning score exceeds maximum");
  if (winner === target && loser <= target - 2) return;
  if (winner > target && winner - loser === 2) return;
  throw new Error("Invalid score");
}
