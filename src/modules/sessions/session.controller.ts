import { Request, Response } from "express";
import { sessionService } from "./session.service";
import asyncHandler from "../../utils/asyncHandler";
import sendResponse from "../../utils/sendResponse";

const createSession = asyncHandler(async (req: Request, res: Response) => {
  const session = await sessionService.createSession(req.user!.userId, req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Session scheduled",
    data: session,
  });
});

const getMySessions = asyncHandler(async (req: Request, res: Response) => {
  const sessions = await sessionService.getMySessions(
    req.user!.userId,
    req.user!.role
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Sessions fetched",
    data: sessions,
  });
});

const getSessionById = asyncHandler(async (req: Request, res: Response) => {
  const session = await sessionService.getSessionById(
    req.params.id as string,
    req.user!.userId
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Session fetched",
    data: session,
  });
});

const updateStatus = asyncHandler(async (req: Request, res: Response) => {
  const session = await sessionService.updateStatus(
    req.params.id as string,
    req.user!.userId,
    req.body.status,
    req.body.notes
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Session status updated",
    data: session,
  });
});

export const sessionController = {
  createSession,
  getMySessions,
  getSessionById,
  updateStatus,
};
