import { NextFunction, Request, Response } from "express";
import { RequestWithUsers } from "../models";
import admin from "firebase-admin";
import serviceAccount from "../../serviceAccountKey.json";
import jwt from "jsonwebtoken";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

export const verifyToken: any = async (req: RequestWithUsers, res: Response, next: NextFunction) => {
  try {
    const bearer = req.headers.authorization?.split(' ') as string[];
    const accessToken = bearer[1];
    const decodedToken = jwt.decode(accessToken) as any; 
    req.googleAuth = { ...decodedToken };
    next();
  } catch (error) {
    console.log(error)
    return res.status(401).json({ error: 'Unauthorized' });
  } 
};

