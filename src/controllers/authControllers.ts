import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import admin from "firebase-admin";
import { serviceAccount } from '../services/serviceAccountKey';

const prisma = new PrismaClient;
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
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
                profilePic: photoURL, 
                details: { ...user, ..._tokenResponse }
            }
        });
    
        return newUser;
    } catch (error) {
        console.log(error)
    }
}

const login = async (details: any) => {
    try {
        const { email } = details.body;
        const user = await prisma.users.findUnique({
            where: {
                email
            }
        });
        
    } catch (error) {
        console.log(error)
    }
}

