
import { Router } from "express";
import userRouter from "./user.js"

const router = Router();

router.use("/userRouter", userRouter)

export default router;
