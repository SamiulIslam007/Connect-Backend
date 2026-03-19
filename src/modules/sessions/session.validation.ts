import { z } from "zod";

export const createSessionSchema = z.object({
  body: z.object({
    requestId: z.string().uuid(),
    scheduledAt: z.string().datetime(),
    durationMin: z.number().int().min(15).max(180).optional().default(60),
    notes: z.string().optional(),
  }),
});

export const updateSessionStatusSchema = z.object({
  body: z.object({
    status: z.enum(["COMPLETED", "NO_SHOW", "CANCELLED"]),
    notes: z.string().optional(),
  }),
});
