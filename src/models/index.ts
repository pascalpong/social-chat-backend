import { User } from "@prisma/client";
import { Request } from "express";


export interface RequestWithUsers extends Request {
    user: User,
    googleAuth: any
}