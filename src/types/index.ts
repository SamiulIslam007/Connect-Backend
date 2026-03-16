import { UserRole } from "../../generated/prisma/client";

export type TJwtPayload = {
  userId: string;
  email: string;
  role: UserRole;
};

declare global {
  namespace Express {
    interface Request {
      user?: TJwtPayload;
    }
  }
}
