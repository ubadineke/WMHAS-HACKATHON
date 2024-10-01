import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { promisify } from 'util';
import { Controller, Middleware } from '../decorators';
import db from '../../prisma';

export default class Auth {
    @Controller()
    public static async login(req: Request, res: Response) {
        res.status(200).json("Let's go");
    }

    @Middleware()
    public static async protect(req: Request, res: Response, next: NextFunction) {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json('You are not logged in. Please log in to gain access!');
        }

        //2) Verifying token
        const verifyJwt = promisify(jwt.verify) as (
            token: string,
            secretOrPublicKey: jwt.Secret,
            options?: jwt.VerifyOptions
        ) => Promise<JwtPayload>;

        const decoded: any = await verifyJwt(token, process.env.JWT_SECRET as string).catch((err) => {
            return res.status(401).json('Invalid token, Please log in again!');
        });
        console.log(decoded);
        // //3) Check if user still exists
        const currentUser = await db.user.findFirst({
            where: { id: decoded.id },
        });

        if (!currentUser) {
            return res
                .status(401)
                .json("The user belonging to this token does not exist/you're not permitted to accesss this feature");
        }
        // // //store user details
        req.user = currentUser;
        next();
    }
}
