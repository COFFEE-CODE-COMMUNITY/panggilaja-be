import { Router } from "express";
import validateToken from "../middleware/validateToken.js";

const userRouter = Router();

userRouter.use(validateToken);
userRouter.get("/", (req, res) => {
  res.send("Ini endpoint user");
});

export default userRouter;
