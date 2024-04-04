import * as express from 'express';
import { register } from '../controllers/authControllers';

const userRouter = express.Router();

// Define routes
userRouter.post('/register', register);

export default userRouter;
