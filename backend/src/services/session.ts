import { prisma } from "../config/prisma";
import { generateToken, hashToken } from "../lib/token";
import { Prisma } from "../../prisma/generated/prisma/client";
import { CreatePlayer, SessionCodeParam } from "../zod-schema";

/**
 * Creates a new session with the given host name.
 * Validates the host name, generates a unique code, host token, and creates
 * the session with the host as the first player.
 *
 * Note: Includes a 20-attempt retry loop for session 'code' collisions.
 * Host token collisions are not handled as they are statistically negligible to warrant retries
 *
 * @param hostName - The pre-validated name of the player hosting the session
 * @returns The created session object and the unhashed host token
 * @throws {Error} If the host name is invalid
 * @throws {Error} If a unique session 'code' cannot be acquired within 20 attempts
 * @throws {Error} If the database operation fails for any other reason
 */
export const createSession = async ({ name: hostName }: CreatePlayer) => {
  const hostToken = generateToken();
  const hashedHostToken = hashToken(hostToken);

  const MAX_ATTEMPTS = 20;

  for (let attempts = 0; attempts < MAX_ATTEMPTS; attempts++) {
    try {
      const code = generateSessionCode();
      const session = await prisma.session.create({
        data: {
          code,
          hostToken: hashedHostToken,
          players: {
            create: { name: hostName },
          },
        },
        include: {
          players: true,
        },
      });
      return { session, hostToken };
    } catch (error: any) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        continue; // We hit a code collision so we try again ('P2002' refers to unique constraint failure)
      }
      throw error;
    }
  }
  throw new Error(
    `Could not generate a unique session code after ${MAX_ATTEMPTS} attempts`,
  );
};

/**
 * Deletes a session by code along with all associated data via cascade.
 *
 * @param code - The code of the session to delete
 * @returns The deleted session
 * @throws {Error} If the session does not exist
 */
export const deleteSession = async ({ code }: SessionCodeParam) => {
  return prisma.session.delete({
    where: { code },
    include: {
      players: true,
      games: {
        include: { playersInGame: { include: { player: true } } },
      },
    },
  });
};

/**
 * Generates a random 4 digit code between 1000 and 9999.
 * Does not guarantee uniqueness against existing sessions.
 *
 * @returns A random 4 digit number
 */
function generateSessionCode() {
  const min = 1000;
  const max = 9999;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
