import passport from 'passport';
import { NextFunction, RequestHandler, Request, Response } from 'express';

// exports.googleAuthMiddleware = passport.authenticate('google', { failureRedirect: '/login', session: false });

export const googleAuthMiddleware = passport.authenticate('google', { failureRedirect: '/login', session: false });

export const handleGoogleAuthCallback: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        // Handle your logic here
        console.log(req.user);
        res.json('User logged in');
    } catch (error) {
        next(error); // Pass any errors to Express's error-handling middleware
    }
};
