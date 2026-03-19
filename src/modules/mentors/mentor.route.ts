import { Router } from "express";
import { authenticate, authorize } from "../../middlewares/auth.middleware";
import { mentorController } from "./mentor.controller";

const router = Router();

router.get("/", mentorController.getAllMentors);
router.get("/:id", mentorController.getMentorById);
router.patch(
  "/me/profile",
  authenticate,
  authorize("MENTOR"),
  mentorController.updateMyProfile
);

export default router;
