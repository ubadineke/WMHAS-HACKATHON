import { Controller } from '../decorators';
import { uploadMultipleImage, uploadSingleImage } from '../utils/uploadImage';
import { Request, Response } from 'express';
import db from '../../prisma';

//Create an Ad
//Delete an Ad
//Edit an Ad

export default class Ad {
    @Controller()
    public static async create(req: Request, res: Response) {
        const { name, id } = req.user;

        if (!req.files) return res.status(400).json('No files uploaded');
        if (!req.files.image) return res.status(400).json('Upload images of product');

        const { cloudinaryUrls, cloudinaryResult } = await uploadMultipleImage(req.files.image, name, 'wmhas');
        const ad = await db.ad.create({
            data: {
                userId: id,
                photos: cloudinaryUrls,
                ...req.fields,
            },
        });
        res.status(200).json(ad);
    }

    // public static async update() {}

    // public static async delete() {}

    @Controller()
    public static async viewAll(req: Request, res: Response) {
        const ads = await db.ad.findMany();
        res.status(200).json(ads);
    }

    @Controller()
    public static async myAds(req: Request, res: Response) {
        const ads = await db.ad.findMany({
            where: {
                // userId: req.user.id,
            },
        });
        res.status(200).json(ads);
    }

    //public static async search(){}

    @Controller()
    public static async getOne(req: Request, res: Response) {
        const { id } = req.params;
        const ad = await db.ad.findFirst({
            where: { id },
        });
        if (!ad) return res.status(400).json('Ad not found');
        res.status(200).json(ad);
    }
}
