import * as jwt from "jsonwebtoken"


const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error("JWT_SECRET is not defined in .env");

export interface JwtPayload {
    userId: string;
}

export function signToken(userId: string | number): string{
    return jwt.sign({userId}, JWT_SECRET!, {expiresIn: "1d"});
}

export function verifyToken(token: string): JwtPayload{
    const decoded = jwt.verify(token, JWT_SECRET!);

    if(typeof decoded === "string"){
        throw new Error("Invalid token payload");
    }
    return decoded as JwtPayload;

}