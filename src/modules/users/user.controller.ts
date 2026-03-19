import { Request, Response } from "express";
import { userService } from "./user.service";
import asyncHandler from "../../utils/asyncHandler";
import sendResponse from "../../utils/sendResponse";

const getMe = asyncHandler(async (req: Request, res: Response) => {
  const user = await userService.getMe(req.user!.userId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User fetched",
    data: user,
  });
});

const updateMe = asyncHandler(async (req: Request, res: Response) => {
  const user = await userService.updateMe(req.user!.userId, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Profile updated",
    data: user,
  });
});

export const userController = { getMe, updateMe };
