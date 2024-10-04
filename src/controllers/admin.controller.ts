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
            },
        });

        // const flattenedAd = {
        //   ...ad,
        //   author:
        // }
        res.status(200).json(reportedAds);
    }

    @Controller()
    public static async takeDownAd(req: Request, res: Response) {
        const { adId: id } = req.body;
        const ad = await db.ad.update({
            where: { id },
            data: {
                active: false,
            },
        });
    }
}
