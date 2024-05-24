import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient;

export const getUsers = async (req: Request, res: Response) => {

    const users = await prisma.user.findMany();

    return res.json({data: users})
}
