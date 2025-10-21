import { Router } from "express";
import authRouter from "./authRoute.js";
import userRouter from "./userRoute.js";
import serviceRouter from "./serviceRoute.js";
import sellerRouter from "./sellerRoute.js";
import orderRouter from "./orderRoute.js";
import favoriteRouter from "./favoriteRoute.js";

const router = Router();

// Auth Route
router.use("/auth", authRouter);

// User Route
router.use("/users", userRouter);

// Service Route
router.use("/services", serviceRouter);

// Service Route
router.use("/sellers", sellerRouter);

// Order Route
router.use("/orders", orderRouter);

// Favorite Route
router.use("/favorites", favoriteRouter);

// Review Route
// router.use("/reviews");

export default router;
