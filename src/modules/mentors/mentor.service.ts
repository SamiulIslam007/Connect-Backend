import { prisma } from "../../lib/prisma";
import AppError from "../../errors/AppError";

const getAllMentors = async () => {
  return prisma.user.findMany({
    where: { role: "MENTOR" },
    select: {
      id: true,
      name: true,
      email: true,
      mentorProfile: true,
    },
  });
};

const getMentorById = async (id: string) => {
  const mentor = await prisma.user.findFirst({
    where: { id, role: "MENTOR" },
    select: {
      id: true,
      name: true,
      email: true,
      mentorProfile: true,
      receivedReviews: {
        select: {
          id: true,
          rating: true,
          comment: true,
          author: { select: { id: true, name: true } },
          createdAt: true,
        },
      },
    },
  });
  if (!mentor) throw new AppError(404, "Mentor not found");
  return mentor;
};

type UpdateMentorInput = {
  bio?: string;
  expertise?: string[];
  experienceYears?: number;
  hourlyRate?: number | null;
  isAvailable?: boolean;
};

const updateMyProfile = async (userId: string, data: UpdateMentorInput) => {
  const profile = await prisma.mentorProfile.upsert({
    where: { userId },
    update: data,
    create: { userId, ...data },
  });
  return profile;
};

const recalculateReputation = async (mentorId: string) => {
  const sessions = await prisma.session.findMany({
    where: {
      request: { mentorId },
      status: { in: ["COMPLETED", "NO_SHOW"] },
    },
    include: { outcome: true },
  });

  const total = sessions.length;
  const successful = sessions.filter(
    (s) => s.status === "COMPLETED" && s.outcome?.isVerified
  ).length;

  const successRate = total > 0 ? (successful / total) * 100 : 0;

  const reviews = await prisma.review.findMany({
    where: { targetId: mentorId },
    select: { rating: true },
  });

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
      : 0;

  const reputationScore = successRate * 0.6 + avgRating * 10 * 0.4;

  await prisma.mentorProfile.update({
    where: { userId: mentorId },
    data: {
      totalSessions: total,
      successRate: Math.round(successRate * 100) / 100,
      reputationScore: Math.round(reputationScore * 100) / 100,
    },
  });
};

export const mentorService = {
  getAllMentors,
  getMentorById,
  updateMyProfile,
  recalculateReputation,
};
