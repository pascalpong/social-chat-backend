// ./routes/home.ts
import * as express from 'express';
import { getUsers } from '../controllers/userControllers';

const userRouter = express.Router();

// Define routes
userRouter.get('/', getUsers);

export default userRouter;
