import { prisma } from "../config/prisma";

/**
 * Creates a new player in the given session.
 *
 * @param name - The name of the player
 * @param sessionId - The ID of the session to add the player to
 * @returns The created player
 * @throws {Error} If the player name is invalid
 * @throws {Error} If the session does not exist
 */
export const createPlayer = async (name: string, sessionId: number) => {
  const cleanedName = validatePlayerName(name);
  return prisma.player.create({
    data: {
      name: cleanedName,
      sessionId,
    },
  });
};

/**
 * Deletes a player by ID.
 *
 * @param id - The ID of the player to delete
 * @returns The deleted player
 * @throws {Error} If the player does not exist
 */
export const deletePlayer = async (id: number) => {
  return prisma.player.delete({
    where: { id },
  });
};

/**
 * Retrieves all players in a given session ordered by when they joined.
 *
 * @param sessionId - The ID of the session to retrieve players for
 * @returns An array of players in the session
 * @throws {Error} If the session does not exist
 */
export const getPlayersBySession = async (sessionId: number) => {
  return prisma.player.findMany({
    where: { sessionId },
    orderBy: { id: "asc" },
  });
};

/**
 * Validates and sanitises a player name.
 * Enforces that the name is non-empty and does not exceed 20 characters.
 *
 * @param name - The player name to validate
 * @returns The trimmed and validated player name
 * @throws {Error} If the name is blank or exceeds 20 characters
 */
export function validatePlayerName(name: string): string {
  if (!name || name.trim().length === 0) {
    throw new Error("Player name is required");
  }
  if (name.trim().length > 20) {
    throw new Error("Player name must be 20 characters or less");
  }
  return name.trim();
}
