// ./routes/home.ts
import express from 'express';
import { getUsers } from '../controllers/userControllers';

const userRouter = express.Router();

// Define routes
userRouter.get('/', getUsers);

export default userRouter;
