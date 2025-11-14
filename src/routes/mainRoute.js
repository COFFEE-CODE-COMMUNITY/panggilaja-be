import { Router } from "express";
import authRouter from "./authRoute.js";
import userRouter from "./userRoute.js";
import serviceRouter from "./serviceRoute.js";
import sellerRouter from "./sellerRoute.js";
import orderRouter from "./orderRoute.js";
import favoriteRouter from "./favoriteRoute.js";
import docsRouter from "./docsRoute.js";
import chatRouter from "./chatRoute.js";
import oauthRouter from "./oauthRoute.js";
import reviewRouter from "./reviewRoute.js";

const router = Router();

// OAuth Route (untuk Google OAuth)
router.use("/", oauthRouter);

// Auth Route
router.use("/auth", authRouter);

// User Route
// public
router.use("/users", userRouter.publicUserRouter);
// protected
router.use("/users", userRouter.protectedUserRoute);

// Service Route
// public
router.use("/services", serviceRouter.publicServiceRouter);
// protected
router.use("/services", serviceRouter.protectedServiceRouter);

// Seller Route
// public
router.use("/sellers", sellerRouter.publicSellerRoute);
// protected
router.use("/sellers", sellerRouter.protectedSellerRoute);

// Order Route
router.use("/orders", orderRouter);

// Documentation Route
router.use("/docs", docsRouter);

// Favorite Route
router.use("/favorites", favoriteRouter);

// Message Route
router.use("/chat", chatRouter);
// Review Route
router.use("/review", reviewRouter);

export default router;
