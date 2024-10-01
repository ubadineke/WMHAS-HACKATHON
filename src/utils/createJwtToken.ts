import jwt from 'jsonwebtoken';

export const signToken = (id: string) => {
    return jwt.sign({ id }, process.env.JWT_SECRET as string, {
        expiresIn: '30d',
    });
};

export default function createAndSendToken() {}
