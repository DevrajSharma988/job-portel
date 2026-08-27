export const isProduction = process.env.NODE_ENV === 'production';

export const accessTokenCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? 'none' : 'strict',
  path: '/',
  maxAge: Number(process.env.ACCESS_COOKIE_MAX_AGE) || 900000,
};

export const refreshTokenCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? 'none' : 'strict',
  path: '/',
  maxAge: Number(process.env.REFRESH_COOKIE_MAX_AGE) || 604800000,
};
