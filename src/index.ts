import express from 'express';
import { config } from 'dotenv';
import authRouter from './routes/auth.route';
import adRouter from './routes/ad.route';
import passport from 'passport';
import passportConfig from './config/oauth';
import { initializeDatabase } from '../prisma';
import cors from 'cors';
config();

const app = express();

app.use(passport.initialize());
passportConfig(passport);

initializeDatabase();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', authRouter);
app.use('/api/', adRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
    console.log(`Server running at port ${PORT}`);
});
