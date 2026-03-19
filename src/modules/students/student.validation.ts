import { z } from "zod";

export const updateStudentProfileSchema = z.object({
  body: z.object({
    goal: z.string().optional(),
    currentLevel: z.string().optional(),
    targetField: z.string().optional(),
    timeline: z.string().optional(),
    obstacles: z.string().optional(),
    desiredOutcome: z.string().optional(),
  }),
});
