import resend from '../../config/resend.config.js';

import verificationOTPTemplate from '../../templates/emails/verificationOTP.template.js';
import forgotPasswordOTPTemplate from '../../templates/emails/forgotPasswordOTP.template.js';

export const sendVerificationOTP = async (email, otp) => {
  console.log(`[DEV ONLY] OTP for ${email} is: ${otp}`);
  try {
    const response = await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Verify your CareerNest account',
      html: verificationOTPTemplate(otp),
    });
    if (response.error) {
      console.error('Resend API returned error:', response.error);
    }
  } catch (error) {
    console.error('Failed to send verification OTP:', error.message);
    // In dev, we log the OTP and allow the flow to continue even if email fails.
  }
};

export const sendForgotPasswordOTP = async (email, otp) => {
  console.log(`[DEV ONLY] Forgot Password OTP for ${email} is: ${otp}`);
  try {
    const response = await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Reset Your Password',
      html: forgotPasswordOTPTemplate(otp),
    });
    if (response.error) {
      console.error('Resend API returned error:', response.error);
    }
  } catch (error) {
    console.error('Failed to send forgot password OTP:', error.message);
  }
};
