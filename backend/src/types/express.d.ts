import {JwtPayload} from "../utils/jwt";

declare global {
    namespace Express {
        interface Request {
            user?: string | number;
            tokenPayload?: JwtPayload;
        }
    }
}
