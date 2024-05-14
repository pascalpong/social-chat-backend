import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
<<<<<<< HEAD
import * as admin from "firebase-admin";

const prisma = new PrismaClient;

import { serviceAccount } from '../services/serviceAccountKey';
admin.initializeApp({
    credential: admin.credential.cert(JSON.stringify(serviceAccount)),
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
=======
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
>>>>>>> ae83fe9609a444fb272d6b02ce9a0c4e15a88c21
    } catch (error) {
        console.log(error)
    }
}

<<<<<<< HEAD
const login = async (details: any) => {
    try {
        const { email } = details.body;
        const user = await prisma.users.findUnique({
            where: {
                email
            }
        });
=======
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
>>>>>>> ae83fe9609a444fb272d6b02ce9a0c4e15a88c21
        
    } catch (error) {
        console.log(error)
    }
}

