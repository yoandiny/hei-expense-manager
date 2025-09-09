import {JwtPayload} from "../utils/jwt";

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: number | string;
                email?: string;
            };
            tokenPayload?: JwtPayload;
        }
    }
}
