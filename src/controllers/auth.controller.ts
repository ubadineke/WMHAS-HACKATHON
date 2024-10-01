import { Request, Response } from 'express';

export default class Auth {
    public static async login(req: Request, res: Response) {
        res.status(200).json("Let's go");
    }
}
