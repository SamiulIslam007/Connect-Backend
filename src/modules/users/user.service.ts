import { prisma } from "../../lib/prisma";
import AppError from "../../errors/AppError";

const getMe = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      mentorProfile: true,
      studentProfile: true,
    },
  });
  if (!user) throw new AppError(404, "User not found");
  return user;
};

const updateMe = async (userId: string, data: { name?: string }) => {
  const user = await prisma.user.update({
    where: { id: userId },
    data,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      updatedAt: true,
    },
  });
  return user;
};

export const userService = { getMe, updateMe };
