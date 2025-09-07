import { Request, Response } from "express";
import prisma from "../PrismaClient.js"

export async  function getProfile(req: Request, res: Response) {
    const userId = (req as any).user;

    if(!userId){
        return res.status(401).json({message:"No user authenticated"});
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