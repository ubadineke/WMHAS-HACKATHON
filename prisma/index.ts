import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

export async function initializeDatabase() {
    try {
        await db.$connect();
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Failed to connect to the database', error);
    }
}

export default db;
