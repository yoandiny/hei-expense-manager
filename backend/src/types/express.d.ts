import { JwtPayload } from "../utils/jwt";

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: number; // ✅ SEULEMENT number — pas de string
                email?: string;
            };
            tokenPayload?: JwtPayload;
        }
    }
}

export {};