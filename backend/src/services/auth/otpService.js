import resend from '../../config/resend.js';

import verificationOTPTemplate from '../../templates/emails/verificationOTPTemplate.js';
import forgotPasswordOTPTemplate from '../../templates/emails/forgotPasswordOTPTemplate.js';

const sendVerificationOTP = async (email, otp) => {
    try {
        await resend.emails.send({
            from: process.env.EMAIL_FROM,
            to: email,
            subject: 'Verify your NIT KKR Academic Portal account',
            html: verificationOTPTemplate(otp),
        });
    } catch (error) {
        console.error('Failed to send verification OTP:', error);

        throw new Error('Failed to send verification OTP.');
    }
};

const sendForgotPasswordOTP = async (email, otp) => {
    await resend.emails.send({
        from: process.env.EMAIL_FROM,
        to: email,
        subject: 'Reset Your Password',
        html: forgotPasswordOTPTemplate(otp),
    });
};

export {
    sendVerificationOTP,
    sendForgotPasswordOTP,
};
