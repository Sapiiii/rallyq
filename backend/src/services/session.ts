import { prisma } from "../config/prisma";
import { validatePlayerName } from "./player";
import { generateToken, hashToken } from "../lib/token";

/**
 * Creates a new session with the given host name.
 * Validates the host name, generates a unique code, and creates
 * the session with the host as the first player.
 *
 * @param hostName - The name of the player hosting the session
 * @returns The created session with its players
 * @throws {Error} If the host name is invalid
 * @throws {Error} If a unique session code cannot be generated within 20 attempts
 * @throws {Error} If the database operation fails
 */
export const createSession = async (hostName: string) => {
  const cleanedHostName = validatePlayerName(hostName);
  const code = await findUniqueCode();
  const token = generateToken();
  const hashedToken = hashToken(token);

  const session = await prisma.session.create({
    data: {
      code,
      hostToken: hashedToken,
      players: {
        create: { name: cleanedHostName },
      },
    },
    include: {
      players: true,
    },
  });

  return { session, token };
};

/**
 * Deletes a session by ID along with all associated data via cascade.
 *
 * @param sessionId - The ID of the session to delete
 * @returns The deleted session
 * @throws {Error} If the session does not exist
 */
export const deleteSession = async (sessionId: number) => {
  return prisma.session.delete({
    where: {
      id: sessionId,
    },
  });
};

/**
 * Generates and returns a unique 4 digit session code.
 * Retries up to 20 times before throwing an error.
 *
 * @returns A unique 4 digit session code
 * @throws {Error} If a unique code cannot be found within 20 attempts
 */
async function findUniqueCode() {
  const maxAttempts = 20;
  for (let i = 0; i < maxAttempts; i++) {
    const generatedCode = generateSessionCode();
    const existing = await prisma.session.findUnique({
      where: { code: generatedCode },
    });
    if (!existing) return generatedCode;
  }
  throw new Error(
    `Could not generate a unique session code after ${maxAttempts} attempts`,
  );
}

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
