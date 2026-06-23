import { prisma } from "../config/prisma";
import { CreatePlayer } from "../zod-schema";
import { SessionCodeParam } from "../zod-schema";

/**
 * Creates a new player in the given session.
 *
 * @param name - The pre-validated name of the player
 * @param code - The code of the session to add the player to
 * @returns The created player
 * @throws {Error} If the session does not exist
 */
export const createPlayer = async ({ name, code }: CreatePlayer) => {
  return prisma.player.create({
    data: {
      name,
      session: {
        connect: {
          code,
        },
      },
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
 * Retrieves all players in the session identified by the given code.
 *
 * Players are returned in ascending player ID order, which is used here
 * as a proxy for join order.
 *
 * @param code - The public session code
 * @returns An array of players in the session
 * @throws {Error} If the session does not exist
 */
export const getPlayersBySession = async ({ code }: SessionCodeParam) => {
  return prisma.player.findMany({
    where: {
      session: {
        code,
      },
    },
    orderBy: { id: "asc" },
  });
};
