import { Router } from 'express';
import { Request, Response } from 'express';
import Auth from '../controllers/auth.controller';
import passport from 'passport';
import { googleAuthMiddleware, handleGoogleAuthCallback } from '../middlewares/google.oauth';

const router = Router();

router.get('/signin', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback', googleAuthMiddleware, handleGoogleAuthCallback);

export default router;
