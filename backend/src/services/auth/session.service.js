import { redisClient } from '../../config/redis.config.js';

import { hashToken } from '../../utils/auth/hashToken.util.js';

export const storeRefreshSession = async (userId, refreshToken) => {
  const hashedRefreshToken = hashToken(refreshToken);
  const expiry = Number(process.env.REDIS_REFRESH_SESSION_EXPIRY_SECONDS) || 604800;

  await redisClient.set(`refreshToken:${userId}`, hashedRefreshToken, {
    EX: expiry,
  });
};

export const getRefreshSession = async (userId) => {
  return await redisClient.get(`refreshToken:${userId}`);
};

export const removeRefreshSession = async (userId) => {
  await redisClient.del(`refreshToken:${userId}`);
};
