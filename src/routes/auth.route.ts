import { Router } from 'express';
import Auth from '../controllers/auth.controller';
import passport from 'passport';
import { googleAuthMiddleware, handleGoogleAuthCallback } from '../middlewares/google.oauth';

const router = Router();
router.post('/signup', Auth.signup);
router.post('/login', Auth.login);
router.get('/signin', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/auth/google/callback', googleAuthMiddleware, handleGoogleAuthCallback);
// router.use(Auth.protect);
router.get('/login', Auth.login);

export default router;
