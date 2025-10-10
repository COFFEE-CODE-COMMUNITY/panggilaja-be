import { Router } from "express";
import authRouter from "./authRoute.js";
import userRouter from "./userRoute.js";
import serviceRouter from "./serviceRoute.js";

const router = Router();

// Auth Route
router.use("/auth", authRouter);

// User Route
router.use("/users", userRouter);

// Service Route
router.use("/services", serviceRouter);

export default router;
