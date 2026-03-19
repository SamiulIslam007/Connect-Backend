import { RequestStatus, UserRole } from "../../../generated/prisma/client";
import AppError from "../../errors/AppError";
import { prisma } from "../../lib/prisma";

type CreateRequestInput = {
  mentorId: string;
  question: string;
  context: string;
  targetOutcome: string;
  timeframe: string;
};

const createRequest = async (studentId: string, input: CreateRequestInput) => {
  const mentor = await prisma.user.findFirst({
    where: { id: input.mentorId, role: "MENTOR" },
    include: { mentorProfile: true },
  });
  if (!mentor) throw new AppError(404, "Mentor not found");
  if (!mentor.mentorProfile?.isAvailable)
    throw new AppError(400, "Mentor is not available");

  return prisma.mentorRequest.create({
    data: { studentId, ...input },
    include: {
      mentor: { select: { id: true, name: true, email: true } },
      student: { select: { id: true, name: true, email: true } },
    },
  });
};

const getRequests = async (userId: string, role: UserRole) => {
  const where =
    role === "STUDENT" ? { studentId: userId } : { mentorId: userId };

  return prisma.mentorRequest.findMany({
    where,
    include: {
      mentor: { select: { id: true, name: true } },
      student: { select: { id: true, name: true } },
      sessions: { select: { id: true, scheduledAt: true, status: true } },
    },
    orderBy: { createdAt: "desc" },
  });
};

const getRequestById = async (id: string, userId: string) => {
  const request = await prisma.mentorRequest.findFirst({
    where: { id, OR: [{ studentId: userId }, { mentorId: userId }] },
    include: {
      mentor: { select: { id: true, name: true, email: true } },
      student: { select: { id: true, name: true, email: true } },
      sessions: true,
    },
  });
  if (!request) throw new AppError(404, "Request not found");
  return request;
};

const updateStatus = async (
  id: string,
  userId: string,
  role: UserRole,
  status: RequestStatus
) => {
  const request = await prisma.mentorRequest.findUnique({ where: { id } });
  if (!request) throw new AppError(404, "Request not found");

  if (role === "STUDENT" && request.studentId !== userId)
    throw new AppError(403, "Forbidden");
  if (role === "MENTOR" && request.mentorId !== userId)
    throw new AppError(403, "Forbidden");

  const allowedByMentor: RequestStatus[] = ["ACCEPTED", "REJECTED"];
  const allowedByStudent: RequestStatus[] = ["CANCELLED"];

  if (role === "MENTOR" && !allowedByMentor.includes(status))
    throw new AppError(400, "Mentors can only accept or reject requests");
  if (role === "STUDENT" && !allowedByStudent.includes(status))
    throw new AppError(400, "Students can only cancel requests");

  return prisma.mentorRequest.update({
    where: { id },
    data: { status },
  });
};

export const requestService = {
  createRequest,
  getRequests,
  getRequestById,
  updateStatus,
};
