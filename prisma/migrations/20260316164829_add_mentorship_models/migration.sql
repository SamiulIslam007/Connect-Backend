/*
  Warnings:

  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.
  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('STUDENT', 'MENTOR', 'ADMIN');

-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "SessionStatus" AS ENUM ('SCHEDULED', 'COMPLETED', 'NO_SHOW', 'CANCELLED');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'STUDENT',
ALTER COLUMN "name" SET NOT NULL;

-- CreateTable
CREATE TABLE "MentorProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bio" TEXT,
    "expertise" TEXT[],
    "experienceYears" INTEGER NOT NULL DEFAULT 0,
    "hourlyRate" DOUBLE PRECISION,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "reputationScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalSessions" INTEGER NOT NULL DEFAULT 0,
    "successRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MentorProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "goal" TEXT,
    "currentLevel" TEXT,
    "targetField" TEXT,
    "timeline" TEXT,
    "obstacles" TEXT,
    "desiredOutcome" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudentProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MentorRequest" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "mentorId" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "context" TEXT NOT NULL,
    "targetOutcome" TEXT NOT NULL,
    "timeframe" TEXT NOT NULL,
    "status" "RequestStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MentorRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "durationMin" INTEGER NOT NULL DEFAULT 60,
    "status" "SessionStatus" NOT NULL DEFAULT 'SCHEDULED',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Outcome" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Outcome_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MentorProfile_userId_key" ON "MentorProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "StudentProfile_userId_key" ON "StudentProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Outcome_sessionId_key" ON "Outcome"("sessionId");

-- AddForeignKey
ALTER TABLE "MentorProfile" ADD CONSTRAINT "MentorProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentProfile" ADD CONSTRAINT "StudentProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MentorRequest" ADD CONSTRAINT "MentorRequest_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MentorRequest" ADD CONSTRAINT "MentorRequest_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "MentorRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Outcome" ADD CONSTRAINT "Outcome_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_targetId_fkey" FOREIGN KEY ("targetId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
