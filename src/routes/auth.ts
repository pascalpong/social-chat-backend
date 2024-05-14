import * as express from 'express';
import { login, register } from '../controllers/authControllers';

const userRouter = express.Router();

// Define routes
userRouter.post('/register', register);
userRouter.post('/login', login);

export default userRouter;
