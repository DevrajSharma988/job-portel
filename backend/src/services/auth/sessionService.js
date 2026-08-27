import { redisClient } from '../../config/redis.js';

import hashToken from '../../utils/auth/hashToken.js';

const storeRefreshSession = async (userId, refreshToken) => {
    const hashedRefreshToken = hashToken(refreshToken);

    await redisClient.set(`refreshToken:${userId}`, hashedRefreshToken, {
        EX: Number(process.env.REDIS_REFRESH_SESSION_EXPIRY_SECONDS),
    });
};

const getRefreshSession = async (userId) => {
    return await redisClient.get(`refreshToken:${userId}`);
};

const removeRefreshSession = async (userId) => {
    await redisClient.del(`refreshToken:${userId}`);
};

export {
    storeRefreshSession,
    getRefreshSession,
    removeRefreshSession,
};
