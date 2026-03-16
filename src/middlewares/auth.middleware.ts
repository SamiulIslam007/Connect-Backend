import { NextFunction, Request, Response } from "express";
import { UserRole } from "../../generated/prisma/client";
import AppError from "../errors/AppError";
import { verifyToken } from "../utils/jwtHelpers";
import config from "../config";

export const authenticate = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  try {
    let token: string | undefined;

    if (req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    } else if (req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      throw new AppError(401, "Unauthorized");
    }

    const decoded = verifyToken(token, config.jwt.secret);
    req.user = decoded;
    next();
  } catch {
    next(new AppError(401, "Unauthorized"));
  }
};

export const authorize = (...roles: UserRole[]) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      next(new AppError(403, "Forbidden"));
      return;
    }
    next();
  };
