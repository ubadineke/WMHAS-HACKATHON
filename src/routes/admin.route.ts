import { Router } from 'express';
import Admin from '../controllers/admin.controller';
import Auth from '../controllers/auth.controller';

const router = Router();

router.use(Auth.protect);
router.use(Auth.restrictToAdmin);
router.get('/reported-ads', Admin.getReportedAds);
router.patch('/ad', Admin.takeDownAd);
router.get('/users', Admin.getAllUsers);

export default router;
