import { z } from "zod";

export const createRequestSchema = z.object({
  body: z.object({
    mentorId: z.string().uuid(),
    question: z.string().min(10),
    context: z.string().min(10),
    targetOutcome: z.string().min(5),
    timeframe: z.string().min(3),
  }),
});

export const updateRequestStatusSchema = z.object({
  body: z.object({
    status: z.enum(["ACCEPTED", "REJECTED", "CANCELLED", "COMPLETED"]),
  }),
});
