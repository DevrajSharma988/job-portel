export const generateOTP = () => {
  const otpLength = Number(process.env.OTP_LENGTH);

  let otp = '';

  for (let i = 0; i < otpLength; i++) {
    otp += Math.floor(Math.random() * 10);
  }

  return otp;
};

export default generateOTP;
