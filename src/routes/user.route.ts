import { Router } from 'express';
import User from '../controllers/user.controller';
import Auth from '../controllers/auth.controller';

const router = Router();

router.use(Auth.protect);
router.get('/orders', User.getOrders);
router.get('/sales', User.getSales);

export default router;
