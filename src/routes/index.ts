import { Router } from "express";
import authRouter from "../modules/auth/auth.route";
import userRouter from "../modules/users/user.route";
import mentorRouter from "../modules/mentors/mentor.route";
import studentRouter from "../modules/students/student.route";
import requestRouter from "../modules/requests/request.route";
import sessionRouter from "../modules/sessions/session.route";
import outcomeRouter from "../modules/outcomes/outcome.route";
import reviewRouter from "../modules/reviews/review.route";

const router = Router();

router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/mentors", mentorRouter);
router.use("/students", studentRouter);
router.use("/requests", requestRouter);
router.use("/sessions", sessionRouter);
router.use("/outcomes", outcomeRouter);
router.use("/reviews", reviewRouter);

export default router;
