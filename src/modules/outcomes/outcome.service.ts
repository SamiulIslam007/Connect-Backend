import AppError from "../../errors/AppError";
import { prisma } from "../../lib/prisma";
import { mentorService } from "../mentors/mentor.service";

const createOutcome = async (userId: string, sessionId: string, description: string) => {
  const session = await prisma.session.findFirst({
    where: {
      id: sessionId,
      status: "COMPLETED",
      OR: [
        { request: { studentId: userId } },
        { request: { mentorId: userId } },
      ],
    },
    include: { request: true },
  });
  if (!session) throw new AppError(404, "Completed session not found");

  const existing = await prisma.outcome.findUnique({ where: { sessionId } });
  if (existing) throw new AppError(409, "Outcome already exists for this session");

  return prisma.outcome.create({
    data: { sessionId, description },
  });
};

const verifyOutcome = async (outcomeId: string, mentorId: string) => {
  const outcome = await prisma.outcome.findFirst({
    where: {
      id: outcomeId,
      session: { request: { mentorId } },
    },
    include: { session: { include: { request: true } } },
  });
  if (!outcome) throw new AppError(404, "Outcome not found");

  const updated = await prisma.outcome.update({
    where: { id: outcomeId },
    data: { isVerified: true },
  });

  await mentorService.recalculateReputation(mentorId);

  return updated;
};

const getOutcomeBySession = async (sessionId: string, userId: string) => {
  const outcome = await prisma.outcome.findFirst({
    where: {
      sessionId,
      session: {
        OR: [
          { request: { studentId: userId } },
          { request: { mentorId: userId } },
        ],
      },
    },
  });
  if (!outcome) throw new AppError(404, "Outcome not found");
  return outcome;
};

export const outcomeService = { createOutcome, verifyOutcome, getOutcomeBySession };
