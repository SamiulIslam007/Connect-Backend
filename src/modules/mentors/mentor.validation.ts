import { z } from "zod";

export const updateMentorProfileSchema = z.object({
  body: z.object({
    bio: z.string().optional(),
    expertise: z.array(z.string()).optional(),
    experienceYears: z.number().int().min(0).optional(),
    hourlyRate: z.number().positive().optional().nullable(),
    isAvailable: z.boolean().optional(),
  }),
});
