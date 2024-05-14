import { Users } from "@prisma/client";
import { Request } from "express";


export interface RequestWithUsers extends Request {
    user: Users,
    googleAuth: any
}