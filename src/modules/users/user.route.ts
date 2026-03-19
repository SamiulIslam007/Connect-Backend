import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { userController } from "./user.controller";

const router = Router();

router.get("/me", authenticate, userController.getMe);
router.patch("/me", authenticate, userController.updateMe);

export default router;
