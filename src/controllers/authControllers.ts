import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient;

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