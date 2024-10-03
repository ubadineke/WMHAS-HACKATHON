import { Router } from 'express';
import Ad from '../controllers/ad.controller';
import Auth from '../controllers/auth.controller';
import { uploadMultiple } from '../middlewares/formidable';

const router = Router();

router.get('/ads', Ad.viewAll);
router.use(Auth.protect);
router.route('/ad').get(Ad.myAds).post(uploadMultiple, Ad.create);
router.route('/ad/:id').get(Ad.getOne);
export default router;
