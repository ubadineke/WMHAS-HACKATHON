import passport from 'passport';
import { NextFunction, RequestHandler, Request, Response } from 'express';
import db from '../../prisma';
import { signToken } from '../utils/createJwtToken';

// exports.googleAuthMiddleware = passport.authenticate('google', { failureRedirect: '/login', session: false });

export const googleAuthMiddleware = passport.authenticate('google', { failureRedirect: '/login', session: false });

export const handleGoogleAuthCallback: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const email = req.user.emails[0].value;
        const user = await db.user.findFirst({
            where: { email },
        });
        const token = signToken(user.id);
        console.log(user);
        // Handle your logic here
        // console.log(req.user);
        res.status(200).json({ message: 'User logged in', token });
    } catch (error) {
        next(error); // Pass any errors to Express's error-handling middleware
    }
};
