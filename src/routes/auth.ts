import * as express from 'express';
import { googleLogin } from '../controllers/authControllers';

const userRouter = express.Router();

// Define routes
userRouter.post('/google', googleLogin);

export default userRouter;
