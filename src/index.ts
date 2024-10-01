import express from 'express';
import { config } from 'dotenv';
import authRouter from './routes/auth.route';
import passport from 'passport';
import passportConfig from './config/oauth';
import { initializeDatabase } from '../prisma';
config();

const app = express();

app.use(passport.initialize());
passportConfig(passport);

initializeDatabase();
app.use('/api', authRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
    console.log(`Server running at port ${PORT}`);
});
