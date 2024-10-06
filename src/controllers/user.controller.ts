import { Request, Response } from 'express';
import { Controller } from '../decorators';
import db from '../../prisma';

export default class User {
    @Controller()
    public static async getOrders(req: Request, res: Response) {
        const orders = await db.escrow.findMany({
            where: {
                buyerId: req.user.id,
            },
            include: {
                ad: {
                    select: {
                        id: true,
                        title: true,
                        address: true,
                        city: true,
                        lga: true,
                        state: true,
                    },
                },
                seller: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
        if (!orders || orders.length === 0) return res.status(404).json('no orders placed');
        res.status(200).json(orders);
    }

    @Controller()
    public static async getSales(req: Request, res: Response) {
        const sales = await db.escrow.findMany({
            where: {
                sellerId: req.user.id,
            },
            include: {
                ad: {
                    select: {
                        id: true,
                        title: true,
                    },
                },
                buyer: {
                    select: {
                        id: true,
                        name: true,
                        address: true,
                        city: true,
                        lga: true,
                        state: true,
                    },
                },
            },
        });
        if (!sales || sales.length === 0) return res.status(404).json('no sales yet');
        res.status(200).json(sales);
    }
}
