import { Controller } from '../decorators';
import { Request, Response } from 'express';
import db from '../../prisma';

export default class Chat {
    @Controller()
    public static async sendMessages(req: Request, res: Response) {
        const { userId: receiverId, content } = req.body;

        if (!receiverId || !content) {
            return res.status(400).json({ message: 'Receiver and content are required.' });
        }

        const message = await db.message.create({
            data: {
                senderId: req.user.id,
                receiverId,
                content,
            },
        });

        res.status(200).json(message);
    }

    @Controller()
    public static async getMessages(req: Request, res: Response) {
        const { userId } = req.query;
        const currentUser = req.user.id;
        const messages = await db.message.findMany({
            where: {
                OR: [
                    { senderId: currentUser, receiverId: userId },
                    { senderId: userId, receiverId: currentUser },
                ],
            },
            orderBy: { createdAt: 'asc' },
        });

        res.status(200).json(messages);
    }
}
