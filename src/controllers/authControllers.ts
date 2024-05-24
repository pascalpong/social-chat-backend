import { Response } from "express";
import { PrismaClient } from "@prisma/client";
import { RequestWithUsers } from "../models";
import { generateRandomToken } from "../utils/crypto";
import { generateTokens } from "../utils/tokens";

const prisma = new PrismaClient;

export const googleLogin : any = async (req: RequestWithUsers, res: Response) => {
    try {
        const { details } = req.body;
        const { type } = details;
        const { email } = details.auth.currentUser;

        const user = await prisma.user.findUnique({
            where: { email }
        });

        if(!user) {
            const auth = await register(details.auth.currentUser, type);
            const { id, email, uid, name, displayName, description, tokens } = auth
            return res.status(200).json({ id, email, uid, name, displayName, description, accessToken: tokens.accessToken })
        } else {
            const { id, email, uid, name, displayName, description, tokens } = user as any
            return res.status(200).json({ id, email, uid, name, displayName, description, accessToken: tokens.accessToken })
        }
    } catch (error) {
        console.log(error)
        return res.status(401).json({ error: 'Unauthorized' });
    }
}

export const verifyLogin: any = async (req: RequestWithUsers, res: Response) => {
    try {
        return res.status(200).json(req.googleAuth.details)
    } catch (error) {
        console.log(error)
        return res.status(401).json({ error: 'Unauthorized' });
    }
}

export const changeDisplayDetails: any = async (req: RequestWithUsers, res: Response) => {
    try {
        const { displayName } = req.body;
        const { uid, email } = req.googleAuth;
        const user = await prisma.user.update({
            where: {
                uid,
                email
            },
            data: {
                displayName
            }
        })
        return res.status(200).json({displayName: user.displayName, message: 'display name changed'})
    } catch (error) {
        console.log(error)
        return res.status(401).json({ error: 'Cannot change display name' });
    }
}
 
const register = async (details: any, type: string) => {
    try {
        const { displayName, email, photoURL, uid } = details;
        const secretTokens = { accessSecret: generateRandomToken(), refreshSecret: generateRandomToken() }
        const data = { 
            email,
            name: displayName,
            uid,
            profilePic: photoURL, 
            details: details,
            secretTokens,
            tokens: await generateTokens(secretTokens, details)
        }

        let newUser: any;
        newUser = await prisma.user.create({ data });
    
        return newUser;
    } catch (error) {
        console.log(error)
    }
}


