import { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import * as jwt from 'jsonwebtoken';
import { RequestWithUsers } from "../models";

const prisma = new PrismaClient;

export const authenticateToken = async (req: RequestWithUsers, res: Response, next: NextFunction) => {
    try {
        // Get the token from the request headers
        const token = req.headers.authorization;

        if (!token) {
            return res.status(401).json({ message: 'Authorization token is missing' });
        }

        // Verify the token
        jwt.verify(token, process.env.JWT_SECRET as string, (err, decodedToken) => {
            if (err) {
                return res.status(401).json({ message: 'Invalid or expired token' });
            }

            // Attach the decoded token to the request object
            console.log(decodedToken)
            // req.user = decodedToken;
            next();
        });
    } catch (error) {
        console.error('Error in authentication middleware:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};