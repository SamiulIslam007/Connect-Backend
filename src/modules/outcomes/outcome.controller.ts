import { Request, Response } from "express";
import { outcomeService } from "./outcome.service";
import asyncHandler from "../../utils/asyncHandler";
import sendResponse from "../../utils/sendResponse";

const createOutcome = asyncHandler(async (req: Request, res: Response) => {
  const outcome = await outcomeService.createOutcome(
    req.user!.userId,
    req.body.sessionId,
    req.body.description
  );
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Outcome recorded",
    data: outcome,
  });
});

const verifyOutcome = asyncHandler(async (req: Request, res: Response) => {
  const outcome = await outcomeService.verifyOutcome(
    req.params.id as string,
    req.user!.userId
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Outcome verified",
    data: outcome,
  });
});

const getOutcomeBySession = asyncHandler(async (req: Request, res: Response) => {
  const outcome = await outcomeService.getOutcomeBySession(
    req.params.sessionId as string,
    req.user!.userId
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Outcome fetched",
    data: outcome,
  });
});

export const outcomeController = { createOutcome, verifyOutcome, getOutcomeBySession };
