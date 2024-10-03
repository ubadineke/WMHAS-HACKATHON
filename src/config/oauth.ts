import {
    Strategy as GoogleStrategy,
    StrategyOptions,
    StrategyOptionsWithRequest,
    VerifyCallback,
} from 'passport-google-oauth20';
import { PassportStatic, Profile } from 'passport';
import { Request } from 'express';
import db from '../../prisma';

export default function (passport: PassportStatic): void {
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.CLIENT_ID || '',
                clientSecret: process.env.CLIENT_SECRET || '',
                callbackURL: `${process.env.BASE_URL}/auth/google/callback`,
            } as StrategyOptionsWithRequest,
            async (req: Request, accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {
                console.log(123);
                try {
                    let name = profile.displayName;
                    let google_id = profile.id;
                    let email = profile.emails[0].value;

                    await db.user.upsert({
                        where: { email },
                        update: {},
                        create: {
                            name,
                            google_id,
                            email,
                        },
                    });

                    console.log({ name, google_id, email });
                    return done(null, profile);
                } catch (error) {
                    console.log('So this is the thanks I get?');
                    return done(error);
                }
            }
        )
    );
}
