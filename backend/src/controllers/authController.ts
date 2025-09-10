import {Request, Response} from "express";
import prisma from "../PrismaClient";
import {comparePassword, hashPassword} from "../utils/password";
import {signToken} from "../utils/jwt"

export async function signup(req: Request, res: Response){
    const { email, password } = req.body;
    try {
        const existing = await prisma.user.findUnique({where: {email}})
        if(existing) return res.status(400).json({message: "Email already in use"})

        const hashed = await hashPassword(password);
        const newUser = await prisma.user.create({
            data: {email, password: hashed},
        })

        const token = signToken(newUser.id);
        res.status(201).json({token, user: {id:newUser.id, email:newUser.email}})
    }catch (error: any){
        console.error(error)
        res.status(500).json({error: error.message ||  "Internal server error"})
    }

}

export async function login(req: Request, res: Response){
    const { email, password } = req.body;
    try {
        const user= await prisma.user.findUnique({where: {email}})
        if(!user) return res.status(401).json({message: "User not found"})

        const isValid = await comparePassword(password, user.password)
        if(!isValid) return res.status(401).json({message: "Invalid password"})
        const token = signToken(user.id);

        res.json({token, user: {id: user.id, email: user.email}});
    } catch (error: any) {
        res.status(500).json({message: error.message || "Invalid login"})
    }
}

export async function me(req: Request, res: Response){
    const userId = (req as any).user;

    try {
        const user = await prisma.user.findUnique({
            where: {id: userId}
        })
        if(!user) return res.status(404).json({message: "User not found"})

        res.json({id: user.id, email: user.email})
    }catch (error: any){
        res.status(500).json({message: error.message ||"Internal server error"})
    }
}