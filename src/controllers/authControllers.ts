import { Response } from "express";
import { PrismaClient } from "@prisma/client";
import { RequestWithUsers } from "../models";

const prisma = new PrismaClient;

export const googleLogin : any = async (req: RequestWithUsers, res: Response) => {
    try {
        const { email } = req.googleAuth;
        const user = await prisma.users.findUnique({
            where: {
                email
            }
        });
        if(!user) {
            const auth = await register(req.googleAuth);
            return res.status(200).json(auth)
        } else {
            return res.status(200).json(user)
        }
    } catch (error) {
        console.log(error)
        return res.status(401).json({ error: 'Unauthorized' });
    }
}
 
const register = async (details: any) => {
    try {
        const { name, email, picture, uid } = details;

        const newUser = await prisma.users.create({
            data: { 
                email,
                name,
                uid,
                profilePic: picture, 
                details
            }
        });
    
        return newUser;
    } catch (error) {
        console.log(error)
    }
}


