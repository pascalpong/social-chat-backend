import express from 'express';
import { changeDisplayDetails, googleLogin, verifyLogin } from '../controllers/authControllers';
import { verifyToken } from '../middlewares/authentication';

const userRouter = express.Router();

// Define routes
userRouter.post('/google', googleLogin);
userRouter.post('/verify-login', verifyToken, verifyLogin);
userRouter.post('/change-display', verifyToken, changeDisplayDetails)

export default userRouter;
