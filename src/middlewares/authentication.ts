import { NextFunction, Request, Response } from "express";
import { RequestWithUsers } from "../models";
import admin from "firebase-admin";
import serviceAccount from "../../serviceAccountKey.json";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

export const verifyToken: any = async (req: RequestWithUsers, res: Response, next: NextFunction) => {
  try {
    const bearer = req.headers.authorization?.split(' ') as string[];
    const idToken = bearer[1];
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    if(checkExpTime(decodedToken.exp)) {
      req.googleAuth = { ...decodedToken };
      next();
    } else {
      return res.status(401).json({ error: 'Token expired' });
    }
  } catch (error) {
    console.log(error)
    return res.status(401).json({ error: 'Unauthorized' });
  } 
};


const checkExpTime = (exp: number): boolean => {
  const currentTime = Math.floor(Date.now() / 1000);
  // Check if can access by access token
  if (currentTime > exp) {
    return true; // can
  } else {
    return false; // cannot
  }

}
