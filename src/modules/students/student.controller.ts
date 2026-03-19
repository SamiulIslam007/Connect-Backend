import { Request, Response } from "express";
import { studentService } from "./student.service";
import asyncHandler from "../../utils/asyncHandler";
import sendResponse from "../../utils/sendResponse";

const getMyProfile = asyncHandler(async (req: Request, res: Response) => {
  const profile = await studentService.getMyProfile(req.user!.userId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Student profile fetched",
    data: profile,
  });
});

const updateMyProfile = asyncHandler(async (req: Request, res: Response) => {
  const profile = await studentService.updateMyProfile(req.user!.userId, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Student profile updated",
    data: profile,
  });
});

export const studentController = { getMyProfile, updateMyProfile };
