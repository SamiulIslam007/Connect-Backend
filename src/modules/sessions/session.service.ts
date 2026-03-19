import { SessionStatus } from "../../../generated/prisma/client";
import AppError from "../../errors/AppError";
import { prisma } from "../../lib/prisma";
import { mentorService } from "../mentors/mentor.service";

type CreateSessionInput = {
  requestId: string;
  scheduledAt: string;
  durationMin?: number;
  notes?: string;
};

const createSession = async (mentorId: string, input: CreateSessionInput) => {
  const request = await prisma.mentorRequest.findFirst({
    where: { id: input.requestId, mentorId, status: "ACCEPTED" },
  });
  if (!request)
    throw new AppError(404, "Accepted request not found for this mentor");

  return prisma.session.create({
    data: {
      requestId: input.requestId,
      scheduledAt: new Date(input.scheduledAt),
      durationMin: input.durationMin ?? 60,
      notes: input.notes,
    },
    include: { request: { include: { student: { select: { id: true, name: true } } } } },
  });
};

const getMySessions = async (userId: string, role: string) => {
  const where =
    role === "STUDENT"
      ? { request: { studentId: userId } }
      : { request: { mentorId: userId } };

  return prisma.session.findMany({
    where,
    include: {
      request: {
        select: {
          id: true,
          question: true,
          student: { select: { id: true, name: true } },
          mentor: { select: { id: true, name: true } },
        },
      },
      outcome: true,
    },
    orderBy: { scheduledAt: "desc" },
  });
};

const getSessionById = async (id: string, userId: string) => {
  const session = await prisma.session.findFirst({
    where: {
      id,
      OR: [
        { request: { studentId: userId } },
        { request: { mentorId: userId } },
      ],
    },
    include: {
      request: {
        include: {
          student: { select: { id: true, name: true } },
          mentor: { select: { id: true, name: true } },
        },
      },
      outcome: true,
    },
  });
  if (!session) throw new AppError(404, "Session not found");
  return session;
};

const updateStatus = async (
  id: string,
  mentorId: string,
  status: SessionStatus,
  notes?: string
) => {
  const session = await prisma.session.findFirst({
    where: { id, request: { mentorId } },
    include: { request: true },
  });
  if (!session) throw new AppError(404, "Session not found");

  const updated = await prisma.session.update({
    where: { id },
    data: { status, ...(notes && { notes }) },
  });

  if (status === "COMPLETED" || status === "NO_SHOW") {
    await mentorService.recalculateReputation(mentorId);
  }

  if (status === "COMPLETED") {
    await prisma.mentorRequest.update({
      where: { id: session.requestId },
      data: { status: "COMPLETED" },
    });
  }

  return updated;
};

export const sessionService = {
  createSession,
  getMySessions,
  getSessionById,
  updateStatus,
};
