import express from 'express';
import { createRoom } from '../controllers/roomControllers'; 

const userRouter = express.Router();

userRouter.post('/', createRoom);

export default userRouter;
