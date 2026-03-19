import express, { Application, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./routes";
import globalErrorHandler from "./middlewares/globalErrorHandler";

const app: Application = express();

app.use(express.json());
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());

app.get("/", (_req: Request, res: Response) => {
  res.json({ success: true, message: "Connect Backend is running" });
});

app.use("/api/v1", router);

app.use(globalErrorHandler);

export default app;
