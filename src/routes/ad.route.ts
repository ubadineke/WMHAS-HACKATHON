import { Router } from 'express';
import Ad from '../controllers/ad.controller';
import Auth from '../controllers/auth.controller';
import { uploadMultiple } from '../middlewares/formidable';
import Payment from '../controllers/payment.controller';

const router = Router();

router.get('/ads', Ad.viewAll);
router.route('/ad').get(Auth.optionalAuth, Ad.getOne);
router.use(Auth.protect);
router.route('/ad').post(uploadMultiple, Ad.create);
router.route('/myAds').get(Ad.myAds);
router.post('/ad/comment', Ad.createComment);
router.post('/ad/comment/reply', Ad.createReply);
router.post('/ad/report', Ad.report);
router.get('/ad/pay', Payment.initializeTransaction);
router.get('/ad/release-funds', Payment.finishTransaction);
router.get('/ad/pay/verify', Payment.verifyTransaction);
export default router;
