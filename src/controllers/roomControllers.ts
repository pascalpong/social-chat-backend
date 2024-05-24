import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { RequestWithUsers } from "../models";
import { generateRandomToken } from "../utils/crypto";

const prisma = new PrismaClient();


export const createRoom: any = async (req: RequestWithUsers, res: Response) => {
    try {
        const { details } = req.googleAuth;
        const { id } = details;
        const { name } = req.body;

        const room = await prisma.room.create({
            data: {
                name,
                createdById: id,
                token: generateRandomToken()
            }
        })

        return res.status(200).json(room)
        
    } catch (error) {
        console.log(error);
    }    
}

export const accessRoom = (req: Request, res: Response) => {
    try {
        
    } catch (error) {
        console.log(error);
    }    
}