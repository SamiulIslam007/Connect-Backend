import { z } from "zod";

export const createReviewSchema = z.object({
  body: z.object({
    targetId: z.string().uuid(),
    sessionId: z.string().uuid(),
    rating: z.number().int().min(1).max(5),
    comment: z.string().optional(),
  }),
});
