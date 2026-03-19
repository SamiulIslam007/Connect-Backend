import { Router } from "express";
import { authenticate, authorize } from "../../middlewares/auth.middleware";
import { requestController } from "./request.controller";

const router = Router();

router.use(authenticate);

router.post("/", authorize("STUDENT"), requestController.createRequest);
router.get("/", requestController.getRequests);
router.get("/:id", requestController.getRequestById);
router.patch("/:id/status", requestController.updateStatus);

export default router;
