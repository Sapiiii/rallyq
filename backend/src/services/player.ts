import { prisma } from "../config/prisma";
import { CreatePlayer } from "../zod-schema";

/**
 * Creates a new player in the given session.
 *
 * @param name - The pre-validated name of the player
 * @param sessionId - The ID of the session to add the player to
 * @returns The created player
 * @throws {Error} If the session does not exist
 */
export const createPlayer = async (
  { name: playerName }: CreatePlayer,
  sessionId: number,
) => {
  return prisma.player.create({
    data: {
      name: playerName,
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
