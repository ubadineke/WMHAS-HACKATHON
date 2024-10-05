import { Request, Response } from 'express';
import db from '../../prisma';
import { Controller } from '../decorators';
import axios from 'axios';

export default class Payment {
    @Controller()
    public static async initializeTransaction(req: Request, res: Response) {
        console.log(1);
        const { id } = req.query;
        if (!id) return res.status(404).json('Ad Id not provided');
        console.log(1, id);

        const ad = await db.ad.findFirst({
            where: { id },
            include: {
                author: {
                    select: {
                        id: true,
                    },
                },
            },
        });

        // return console.log(ad);
        if (!ad) return res.status(404).json('No ad found');

        const data = {
            email: req.user.email,
            amount: parseInt(ad.price) * 100,
        };
        const token = process.env.PS_TEST_SECRET;
        const headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        };

        const response = await axios.post('https://api.paystack.co/transaction/initialize', data, {
            headers,
        });

        const tx = await db.escrow.create({
            data: {
                amount: ad.price,
                reference: response.data.data.reference,
                sellerId: ad.author.id,
                buyerId: req.user.id,
            },
        });

        const cred = response.data.data;
        res.status(200).json(response.data);
        console.log(cred);
    }

    @Controller()
    public static async verifyTransaction(req: Request, res: Response) {
        const { reference } = req.query;
        const token = process.env.PS_TEST_SECRET;
        const headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        };

        const response = await axios
            .get(`https://api.paystack.co/transaction/verify/${reference}`, {
                headers,
            })
            .catch((err) => {
                return res.status(400).json('Transaction not found');
            });
        let tx;
        if (response.data.data.status === 'success') {
            tx = await db.escrow.update({
                where: { reference },
                data: {
                    verified: true,
                },
            });
        }
        res.status(200).json({
            status: 'success',
            message: `Transaction ${response.data.data.status}`,
            tx,
        });
    }
}
