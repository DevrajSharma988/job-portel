import { accessTokenCookieOptions, refreshTokenCookieOptions } from './cookieOptions.util.js';

export const sendTokenResponse = (res, statusCode, message, { user, accessToken, refreshToken }) => {
  res.cookie('accessToken', accessToken, accessTokenCookieOptions);

  res.cookie('refreshToken', refreshToken, refreshTokenCookieOptions);

  return res.status(statusCode).json({
    success: true,
    message,
    user: {
      _id: user._id,
      email: user.email,
      fullname: user.fullname,
      role: user.role,
      profile: user.profile,
      isVerified: user.isVerified,
    },
  });
};

export default sendTokenResponse;
