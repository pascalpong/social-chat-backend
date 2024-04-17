import * as express from "express";
import userRouter from "./user";
import authRouter from "./auth";
import { authenticateToken } from "../middlewares/authentication";

const router = express.Router();

router.use('/user', authenticateToken, userRouter);
router.use('/auth', authRouter);

export default router;
