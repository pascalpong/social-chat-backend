import express from "express";
import userRouter from "./user";
import authRouter from "./auth";
import { verifyToken } from "../middlewares/authentication";

const router = express.Router();

router.use('/user', verifyToken, userRouter);
router.use('/auth', authRouter);

export default router;
