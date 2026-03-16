import bcrypt from "bcrypt";
import { UserRole } from "../../../generated/prisma/client";
import AppError from "../../errors/AppError";
import { prisma } from "../../lib/prisma";
import { signToken } from "../../utils/jwtHelpers";
import config from "../../config";

type RegisterInput = {
  name: string;
  email: string;
  password: string;
  role: UserRole;
};

type LoginInput = {
  email: string;
  password: string;
};

const generateTokens = (userId: string, email: string, role: UserRole) => {
  const accessToken = signToken(
    { userId, email, role },
    config.jwt.secret,
    config.jwt.expiresIn
  );
  const refreshToken = signToken(
    { userId, email, role },
    config.jwt.refreshSecret,
    config.jwt.refreshExpiresIn
  );
  return { accessToken, refreshToken };
};

const register = async (input: RegisterInput) => {
  const exists = await prisma.user.findUnique({ where: { email: input.email } });
  if (exists) throw new AppError(409, "Email already registered");

  const hashedPassword = await bcrypt.hash(input.password, 10);

  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      password: hashedPassword,
      role: input.role,
      ...(input.role === "MENTOR"
        ? { mentorProfile: { create: {} } }
        : { studentProfile: { create: {} } }),
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  const tokens = generateTokens(user.id, user.email, user.role);
  return { user, tokens };
};

const login = async (input: LoginInput) => {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user) throw new AppError(401, "Invalid credentials");

  const passwordMatch = await bcrypt.compare(input.password, user.password);
  if (!passwordMatch) throw new AppError(401, "Invalid credentials");

  const tokens = generateTokens(user.id, user.email, user.role);

  const { password: _, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, tokens };
};

const refreshAccessToken = (userId: string, email: string, role: UserRole) => {
  return signToken({ userId, email, role }, config.jwt.secret, config.jwt.expiresIn);
};

export const authService = { register, login, refreshAccessToken };
