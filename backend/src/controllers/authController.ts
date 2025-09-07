import {Request, Response} from "express";
import prisma from "../PrismaClient.js";
import {hashPassword} from "../utils/password.js";
import {signToken} from "../utils/jwt.js";

export async function signup(req: Request, res: Response){
    const { email, password } = req.body;

    const existing = await prisma.user.findUnique({where: {email}})
    if(existing) return res.status(400).json({message: "User already exists"})

    const hashed = await hashPassword(password);

    const newUser = await prisma.user.create({
        data: {email, password: hashed},
    })

    res.json({message: "User created successfully", id: newUser.id})
}

export async function login(req: Request, res: Response){
    const { email, password } = req.body;

    const user= await prisma.user.findUnique({where: {email}})
    if(!user) return res.status(400).json({message: "User not found"})

    const token = signToken(user.id);

    res.json({token});
}

export async function me(req: Request, res: Response){
    const userId = (req as any).user;

    const user = await prisma.user.findUnique({
        where: {id: userId}
    })
    if(!user) return res.status(400).json({message: "User not found"})

    res.json({id: user.id, email: user.email})
}