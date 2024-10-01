import {
    Strategy as GoogleStrategy,
    StrategyOptions,
    StrategyOptionsWithRequest,
    VerifyCallback,
} from 'passport-google-oauth20';
import { PassportStatic, Profile } from 'passport';
import { Request } from 'express';

// interface Profile {
//     id: string;
//     displayName: string;
//     emails: { value: string }[];
// }
export default function (passport: PassportStatic): void {
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.CLIENT_ID || '',
                clientSecret: process.env.CLIENT_SECRET || '',
                callbackURL: 'http://localhost:3000/api/auth/google/callback',
            } as StrategyOptionsWithRequest,
            async (req: Request, accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {
                try {
                    let name = profile.displayName;
                    let google_id = profile.id;
                    let email = profile.emails[0].value;

                    console.log({ name, google_id, email });
                    return done(null, profile);
                } catch (error) {
                    return done(error);
                }
            }
        )
    );
}
