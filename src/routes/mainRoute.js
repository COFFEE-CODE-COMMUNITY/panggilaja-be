import { Router } from "express";
import authRouter from "./authRoute.js";
import userRouter from "./userRoute.js";

const router = Router();

// Auth Route
router.use("/auth", authRouter);

// User Route
router.use("/users", userRouter);

export default router;
