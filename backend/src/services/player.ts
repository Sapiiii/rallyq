/**
 * Validates and sanitizes a player name.
 * Enforces that the name is non-empty and does not exceed 20 characters.
 * @throws {Error} If the name is blank or exceeds 20 characters.
 * @returns {string} The trimmed and validated player name.
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
