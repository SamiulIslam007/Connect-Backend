import { Router } from "express";
import { authenticate, authorize } from "../../middlewares/auth.middleware";
import { studentController } from "./student.controller";

const router = Router();

router.use(authenticate, authorize("STUDENT"));

router.get("/me/profile", studentController.getMyProfile);
router.patch("/me/profile", studentController.updateMyProfile);

export default router;
