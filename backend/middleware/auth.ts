import {Request, Response, NextFunction} from 'express';
import {verifyToken} from "../utils/jwt";

export function authMiddleware(req: Request, res: Response, next: NextFunction){
    try{
        const header = req.headers.authorization;

        if(!header){
            return res.status(401).json({message: "No token provided"})
        }

        const token = header.split(" ")[1];
        const payload = verifyToken(token)

        (req as any).user = payload.userId;

        next();
    } catch (error){
        res.status(401).json({message: "Invalid Token"})
    }

}