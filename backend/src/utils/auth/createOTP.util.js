import bcrypt from 'bcryptjs';
import generateOTP from './generateOTP.util.js';

export const createOTP = async () => {
  const otp = generateOTP();

  const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;
  const expiryMinutes = Number(process.env.OTP_EXPIRY_MINUTES) || 15;

  return {
    otp,
    hashedOTP: await bcrypt.hash(otp, saltRounds),
    expiresAt: new Date(Date.now() + expiryMinutes * 60 * 1000),
  };
};

export default createOTP;
