import bcrypt from 'bcryptjs';
import generateOTP from './generateOTP.js';

const createOTP = async () => {
  const otp = generateOTP();

  return {
    otp,
    hashedOTP: await bcrypt.hash(otp, Number(process.env.BCRYPT_SALT_ROUNDS)),
    expiresAt: new Date(Date.now() + Number(process.env.OTP_EXPIRY_MINUTES) * 60 * 1000),
  };
};

export default createOTP;
