import { Router } from "express";
import { authenticate, authorize } from "../../middlewares/auth.middleware";
import { sessionController } from "./session.controller";

const router = Router();

router.use(authenticate);

router.post("/", authorize("MENTOR"), sessionController.createSession);
router.get("/", sessionController.getMySessions);
router.get("/:id", sessionController.getSessionById);
router.patch("/:id/status", authorize("MENTOR"), sessionController.updateStatus);

export default router;
