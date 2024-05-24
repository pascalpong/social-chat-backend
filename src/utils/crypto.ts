import crypto from 'crypto';

export const generateRandomToken = (length = 32) => {
    return crypto.randomBytes(length).toString('hex');
};