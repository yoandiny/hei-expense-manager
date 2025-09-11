import { Request, Response } from "express";
import prisma from "../PrismaClient.js"
import bcrypt from "bcrypt"


export async  function getProfile(req: Request, res: Response) {
    const user = (req as any).user;

    if(!user?.id){
        return res.status(404).json({message:"User not found"});
    }
    try{
        const userData = await prisma.user.findUnique({
            where: {id: user.id},
            include: {expenses: true, incomes: true, categories: true}
        });
        res.json(userData)
    }catch (error){
        console.log("Erreur getProfile:", error)
        res.status(500).json({error: "Internal server error"})
    }
}

export async function updateProfile(req: Request, res: Response){
    const user = (req as any).user;
    const {email, password} = req.body;

    if(!user?.id){
        return res.status(404).json({message:"User not found"});
    }

    try{
        const data: any = {};

        if(email) data.email = email;
        if(password) data.password = await bcrypt.hash(password, 10);

        const updatedUser = await prisma.user.update({
            where: {id: user.id},
            data,
            include: { expenses: true, incomes: true, categories: true}
        })

        res.json(updatedUser);
    }catch (error: any){
        console.error("Erreur updateProfile:",error)
        res.status(500).json({error: error.message})
    }
}