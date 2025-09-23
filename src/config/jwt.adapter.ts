import jwt from 'jsonwebtoken';
import { envs } from './envs';

export class JwtAdapter {
    constructor() { }
    static async generateToken(payload: any, duration: number | `${number}${'s' | 'm' | 'h' | 'd'}` = '2h') {

        return new Promise((resolve, reject) => {
            jwt.sign(payload, envs.JWT_SEED, { expiresIn: duration }, (err, token) => {
                if (err) return resolve(null);
                resolve(token);
            });
        });
    }
    static async validateToken(token: string) {
        return new Promise((resolve, reject) => {
            jwt.verify(token, envs.JWT_SEED, (err, payload) => {
                if (err) return resolve(null);
                resolve(payload);
            });
        });
    }
}