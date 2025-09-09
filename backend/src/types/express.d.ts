import {JwtPayload} from "../utils/jwt";

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: number;
                email?: string;
            };
            tokenPayload?: JwtPayload;
        }
    }
}
