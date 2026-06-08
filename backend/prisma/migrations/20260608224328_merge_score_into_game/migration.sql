/*
  Warnings:

  - You are about to drop the `Score` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `teamAScore` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Added the required column `teamBScore` to the `Game` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Score" DROP CONSTRAINT "Score_gameId_fkey";

-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "teamAScore" INTEGER NOT NULL,
ADD COLUMN     "teamBScore" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Score";

-- DropEnum
DROP TYPE "ScoringSystem";
