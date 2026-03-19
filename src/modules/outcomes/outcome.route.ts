import { Router } from "express";
import { authenticate, authorize } from "../../middlewares/auth.middleware";
import { outcomeController } from "./outcome.controller";

const router = Router();

router.use(authenticate);

router.post("/", outcomeController.createOutcome);
router.get("/session/:sessionId", outcomeController.getOutcomeBySession);
router.patch("/:id/verify", authorize("MENTOR"), outcomeController.verifyOutcome);

export default router;
