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

        if (!ads) return res.status(400).json('No reported ads');
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
        const { adId: id } = req.query;
        const ad = await db.ad.update({
            where: { id },
            data: {
                active: false,
            },
        });
    }

    //send user email or notification
}
