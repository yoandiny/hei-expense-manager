import {Request, Response, NextFunction} from 'express';
import { verifyToken} from "../utils/jwt.js";

export function authMiddleware(req: Request, res: Response, next: NextFunction){
    try{
        const header = req.headers.authorization;

        if(!header || !header.startsWith("Bearer ")){
            return res.status(401).json({message: "No token provided"})
        }

        const token = header.split(" ")[1];
        const payload = verifyToken(token)

        req.user = {
            id: payload.userId,
            email: payload.email
        }
        req.tokenPayload = payload;
        next();
    } catch (error){
        res.status(401).json({message: "Invalid Token"})
    }
}
