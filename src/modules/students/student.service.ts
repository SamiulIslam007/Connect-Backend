import { prisma } from "../../lib/prisma";
import AppError from "../../errors/AppError";

const getMyProfile = async (userId: string) => {
  const profile = await prisma.studentProfile.findUnique({ where: { userId } });
  if (!profile) throw new AppError(404, "Student profile not found");
  return profile;
};

type UpdateStudentInput = {
  goal?: string;
  currentLevel?: string;
  targetField?: string;
  timeline?: string;
  obstacles?: string;
  desiredOutcome?: string;
};

const updateMyProfile = async (userId: string, data: UpdateStudentInput) => {
  return prisma.studentProfile.upsert({
    where: { userId },
    update: data,
    create: { userId, ...data },
  });
};

export const studentService = { getMyProfile, updateMyProfile };
