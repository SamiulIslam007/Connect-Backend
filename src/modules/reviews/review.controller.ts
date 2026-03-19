import { Request, Response } from "express";
import { reviewService } from "./review.service";
import asyncHandler from "../../utils/asyncHandler";
import sendResponse from "../../utils/sendResponse";

const createReview = asyncHandler(async (req: Request, res: Response) => {
  const review = await reviewService.createReview(req.user!.userId, req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Review submitted",
    data: review,
  });
});

const getMentorReviews = asyncHandler(async (req: Request, res: Response) => {
  const reviews = await reviewService.getMentorReviews(req.params.mentorId as string);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Reviews fetched",
    data: reviews,
  });
});

export const reviewController = { createReview, getMentorReviews };
