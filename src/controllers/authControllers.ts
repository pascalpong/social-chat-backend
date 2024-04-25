import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";
import * as jwt from 'jsonwebtoken';
import { error } from "console";


const prisma = new PrismaClient;

const CLIENT_ID = process.env.INSTAGRAM_CLIENT_ID;
const CLIENT_SECRET = process.env.INSTAGRAM_CLIENT_SECRET;

export const googleLogin = async (req: Request, res: Response) => {
    
}
 
export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, username, password } = req.body;
        if(!name || !email || !username || !password ) {
            return res.status(500).json({message: "Cannot create users"})
        }
        const hashedPassword = await bcrypt.hash(password, 10);
    
        const newUser = await prisma.users.create({
            data: { name, email, username, password: hashedPassword }
        });
    
        return res.status(200).json({data: newUser})
    } catch (error) {
        console.log(error)
    }
}

export const login = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;
        const user = await prisma.users.findUnique({
            where: {
                username
            }
        });
        const checkPassword = await bcrypt.compare(password, user.password);
        if(checkPassword) {

            const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY , {
                expiresIn: '1h',
            });
            const data = { ...user, token }
            return res.status(200).json(data)
        } else {
            throw error;
        }
        
    } catch (error) {
        console.log(error)
    }
}

