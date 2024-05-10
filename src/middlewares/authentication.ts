import { NextFunction, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { RequestWithUsers } from "../models";

const prisma = new PrismaClient; 

export const verifyToken = async (req: RequestWithUsers, res: Response, next: NextFunction) => {
    const idToken = req.body.stsTokenManager.accessToken;
    try {
        // const decodedToken = await admin.auth().verifyIdToken(idToken);
        // req.googleAuth = { ...decodedToken }
        next();
    } catch (error) {
        res.status(401).json({ error: 'Unauthorized' });
    }
};