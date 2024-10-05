import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { promisify } from 'util';
import { Controller, Middleware } from '../decorators';
import db from '../../prisma';
import bcrypt from 'bcryptjs';
import { signToken } from '../utils/createJwtToken';

export default class Auth {
    @Controller()
    public static async signup(req: Request, res: Response) {
        const { name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await db.user.create({
            data: {
                ...req.body,
                role: 'ADMIN',
                password: hashedPassword,
            },
        });
        const token = signToken(user.id);

        res.status(201).json({ message: 'Signup successful', token });
    }

    @Controller()
    public static async login(req: Request, res: Response) {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                status: 'fail',
                message: 'Please provide email and password',
            });
        }
        const user = await db.user.findFirst({
            where: { email },
        });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({
                status: 'fail',
                message: 'Incorrect email or password',
            });
        }

        const token = signToken(user.id);
        res.status(200).json({ message: 'Login successful', token });
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
        // console.log(decoded);
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

    public static async optionalAuth(req: Request, res: Response, next: NextFunction) {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        // If no token, just allow the request to proceed
        if (!token) {
            return next();
        }

        // Verify the token
        const verifyJwt = promisify(jwt.verify) as (
            token: string,
            secretOrPublicKey: jwt.Secret,
            options?: jwt.VerifyOptions
        ) => Promise<JwtPayload>;

        const decoded: any = await verifyJwt(token, process.env.JWT_SECRET as string);

        const currentUser = await db.user.findFirst({
            where: { id: decoded.id },
        });

        if (!currentUser) {
            return next(); // Still allow access
        }

        // Store user details if authenticated
        req.user = currentUser;

        next();
    }

    @Middleware()
    public static async restrictToAdmin(req: Request, res: Response, next: NextFunction) {
        if (req.user.role !== 'ADMIN') {
            return res.status(403).json('You do not have permission to perform this action');
        }
        next();
    }
}
