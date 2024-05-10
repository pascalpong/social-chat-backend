import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import * as admin from "firebase-admin";

const prisma = new PrismaClient;

const serviceAccount = require('../services/serviceAccountKey.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

export const googleLogin = async (req: Request, res: Response) => {
    const idToken = req.body.stsTokenManager.accessToken;
    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const { email } = decodedToken;

        const user = await prisma.users.findUnique({
            where: {
                email
            }
        });
        if(!user) {
            login(decodedToken)
        } else {
            register(decodedToken)
        }
    } catch (error) {
        console.log(error)
        return res.status(401).json({ error: 'Unauthorized' });
    }
}
 
const register = async (details: any) => {
    try {
        const { user, _tokenResponse } = details;
        const { email, photoURL, fullname } = user

        const newUser = await prisma.users.create({
            data: { 
                email, 
                fullname, 
                profilePic: photoURL, 
                details: { ...user, ..._tokenResponse }
            }
        });
    
        return res.status(200).json({data: newUser})
    } catch (error) {
        console.log(error)
    }
}

const login = async (details: any) => {
    try {
        const { email } = req.body;
        const user = await prisma.users.findUnique({
            where: {
                email
            }
        });
        
    } catch (error) {
        console.log(error)
    }
}

