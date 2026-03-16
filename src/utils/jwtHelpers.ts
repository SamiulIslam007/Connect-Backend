import jwt, { SignOptions } from "jsonwebtoken";
import { TJwtPayload } from "../types";

export const signToken = (
  payload: TJwtPayload,
  secret: string,
  expiresIn: string
): string => {
  return jwt.sign(payload, secret, { expiresIn } as SignOptions);
};

export const verifyToken = (token: string, secret: string): TJwtPayload => {
  return jwt.verify(token, secret) as TJwtPayload;
};
