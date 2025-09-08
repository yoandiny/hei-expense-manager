import { Request, Response } from "express";
import prisma from "../PrismaClient.js"
import bcrypt from "bcrypt"


// GET /api/user/profile
export async  function getProfile(req: Request, res: Response) {
    const userId = (req as any).user;

    if(!userId){
        return res.status(404).json({message:"User not found"});
    }
    try{
        const user = await prisma.user.findUnique({
            where: {id: Number(userId)},
            include: {expenses: true, incomes: true, categories: true}
        });
        res.json(user)
    }catch (error){
        res.status(500).json({error: "Internal server error"})
    }
}

//PUT /apit/user/profile
export async function updateProfile(req: Request, res: Response){
    const userId = (req as any).user;
    const {email, password} = req.body;

    if(!userId){
        return res.status(404).json({message:"User not found"});
    }

    try{
        const data: any = {};

        if(email) data.email = email;
        if(password) data.password = await bcrypt.hash(password, data.password);

        const updatedUser = await prisma.user.update({
            where: {id: Number(userId)},
            data,
            include: { expenses: true, incomes: true, categories: true}
        })

        res.json(updatedUser);
    }catch (error: any){
        console.error(error)
        res.status(500).json({error: error.message})
    }
}