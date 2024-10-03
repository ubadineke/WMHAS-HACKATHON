import express from 'express';
import { TUser } from './types';

declare global {
    namespace Express {
        interface Request {
            user?: any;
            // session?: any;
        }
    }
}
