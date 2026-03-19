import { Request, Response } from "express";
import { mentorService } from "./mentor.service";
import asyncHandler from "../../utils/asyncHandler";
import sendResponse from "../../utils/sendResponse";

const getAllMentors = asyncHandler(async (_req: Request, res: Response) => {
  const mentors = await mentorService.getAllMentors();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Mentors fetched",
    data: mentors,
  });
});

const getMentorById = asyncHandler(async (req: Request, res: Response) => {
  const mentor = await mentorService.getMentorById(req.params.id as string);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Mentor fetched",
    data: mentor,
  });
});

const updateMyProfile = asyncHandler(async (req: Request, res: Response) => {
  const profile = await mentorService.updateMyProfile(req.user!.userId, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Mentor profile updated",
    data: profile,
  });
});

export const mentorController = { getAllMentors, getMentorById, updateMyProfile };
