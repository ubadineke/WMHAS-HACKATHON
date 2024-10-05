import { Controller } from '../decorators';
import { Request, Response } from 'express';
import db from '../../prisma';

export default class Admin {
    @Controller()
    public static async getReportedAds(req: Request, res: Response) {
        const ads = await db.reportedAd.findMany({
            include: {
                ad: {
                    select: {
                        title: true,
                        author: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
                reportedBy: {
                    select: {
                        name: true,
                    },
                },
            },
        });
        console.log(ads);

        if (!ads || ads.length === 0) return res.status(400).json('No reported ads');
        const flattenedAds = ads.map((ad) => ({
            id: ad.id,
            description: ad.description,
            createdAt: ad.createdAt,
            updatedAt: ad.updatedAt,
            adId: ad.adId,
            userId: ad.userId,
            title: ad.ad.title || '', // Flattened title from ad
            author: ad.ad.author?.name || '', // Flattened author name
            reportedBy: ad.reportedBy?.name || '', // Flattened reportedBy name
        }));

        res.status(200).json(flattenedAds);
    }

    @Controller()
    public static async takeDownAd(req: Request, res: Response) {
        const { id } = req.query;
        console.log(id);
        const ad = await db.ad.update({
            where: { id },
            data: {
                active: false,
            },
        });
        //write validation to handle error when update fails.

        //send user email or notification that Ad has been taken down.
    }

    @Controller()
    public static async getAllUsers(req: Request, res: Response) {
        const users = await db.user.findMany();
        if (!users) return res.status(404).json('Users not found');
        res.status(200).json(users);
    }
}
