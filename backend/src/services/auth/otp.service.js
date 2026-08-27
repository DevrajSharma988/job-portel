import resend from '../../config/resend.config.js';

import verificationOTPTemplate from '../../templates/emails/verificationOTP.template.js';
import forgotPasswordOTPTemplate from '../../templates/emails/forgotPasswordOTP.template.js';

export const sendVerificationOTP = async (email, otp) => {
  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Verify your Job Portal account',
      html: verificationOTPTemplate(otp),
    });
  } catch (error) {
    console.error('Failed to send verification OTP:', error);

    throw new Error('Failed to send verification OTP.');
  }
};

export const sendForgotPasswordOTP = async (email, otp) => {
  await resend.emails.send({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Reset Your Password',
    html: forgotPasswordOTPTemplate(otp),
  });
};
