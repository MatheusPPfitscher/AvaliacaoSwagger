import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const SECRET = process.env.TOKEN_SECRET as string;

export function extractTokenFromHeader(authHeader: string): string {
    return authHeader.split(" ")[1];
}

export const validateToken = function (req: Request, res: Response, next: NextFunction) {
    const authHeader: string = req.headers.authorization as string;
    try {
        const token = extractTokenFromHeader(authHeader);
        let data = jwt.verify(token, SECRET);
        res.locals.userid = data.userid;
        next();
    }
    catch {
        return res.status(400).send({
            msg: "ExpiredToken"
        });
    }
};