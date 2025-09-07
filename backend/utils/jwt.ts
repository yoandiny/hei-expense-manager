import jwt from "jsonwebtoken"
import * as dotenv from "dotenv";

export function signToken(userId: string): string{
    return jwt.sign({userId}, process.env.JWT_SECRET, {expiresIn: "1d"});
}

export function verifyToken(token: string): any{
    return jwt.verify(token, process.env.JWT_SECRET);
}