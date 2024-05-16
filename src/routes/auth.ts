import express from 'express';
import { googleLogin } from '../controllers/authControllers';
import { verifyToken } from '../middlewares/authentication';

const userRouter = express.Router();

// Define routes
userRouter.post('/google', verifyToken , googleLogin);

export default userRouter;
