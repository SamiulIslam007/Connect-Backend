import AppError from "../../errors/AppError";
import { prisma } from "../../lib/prisma";
import { mentorService } from "../mentors/mentor.service";

type CreateReviewInput = {
  targetId: string;
  sessionId: string;
  rating: number;
  comment?: string;
};

const createReview = async (authorId: string, input: CreateReviewInput) => {
  const session = await prisma.session.findFirst({
    where: {
      id: input.sessionId,
      status: "COMPLETED",
      request: { studentId: authorId, mentorId: input.targetId },
    },
  });
  if (!session)
    throw new AppError(400, "Can only review after a completed session");

  const existing = await prisma.review.findFirst({
    where: { authorId, targetId: input.targetId },
  });
  if (existing) throw new AppError(409, "You have already reviewed this mentor");

  const review = await prisma.review.create({
    data: {
      authorId,
      targetId: input.targetId,
      rating: input.rating,
      comment: input.comment,
    },
    include: {
      author: { select: { id: true, name: true } },
      target: { select: { id: true, name: true } },
    },
  });

  await mentorService.recalculateReputation(input.targetId);

  return review;
};

const getMentorReviews = async (mentorId: string) => {
  return prisma.review.findMany({
    where: { targetId: mentorId },
    include: {
      author: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: "desc" },
  });
};

export const reviewService = { createReview, getMentorReviews };
