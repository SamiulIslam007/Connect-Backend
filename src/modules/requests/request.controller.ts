import { Request, Response } from "express";
import { requestService } from "./request.service";
import asyncHandler from "../../utils/asyncHandler";
import sendResponse from "../../utils/sendResponse";

const createRequest = asyncHandler(async (req: Request, res: Response) => {
  const request = await requestService.createRequest(req.user!.userId, req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Request created",
    data: request,
  });
});

const getRequests = asyncHandler(async (req: Request, res: Response) => {
  const requests = await requestService.getRequests(
    req.user!.userId,
    req.user!.role
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Requests fetched",
    data: requests,
  });
});

const getRequestById = asyncHandler(async (req: Request, res: Response) => {
  const request = await requestService.getRequestById(
    req.params.id as string,
    req.user!.userId
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Request fetched",
    data: request,
  });
});

const updateStatus = asyncHandler(async (req: Request, res: Response) => {
  const request = await requestService.updateStatus(
    req.params.id as string,
    req.user!.userId,
    req.user!.role,
    req.body.status
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Request status updated",
    data: request,
  });
});

export const requestController = {
  createRequest,
  getRequests,
  getRequestById,
  updateStatus,
};
