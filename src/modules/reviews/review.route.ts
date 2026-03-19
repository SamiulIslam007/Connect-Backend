import { Router } from "express";
import { authenticate, authorize } from "../../middlewares/auth.middleware";
import { reviewController } from "./review.controller";

const router = Router();

router.get("/mentor/:mentorId", reviewController.getMentorReviews);
router.post("/", authenticate, authorize("STUDENT"), reviewController.createReview);

export default router;
