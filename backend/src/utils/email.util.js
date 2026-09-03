import resend from '../config/resend.config.js';

export const sendEmail = async (options) => {
    try {
        const { data, error } = await resend.emails.send({
            from: process.env.EMAIL_FROM || 'CareerNest <noreply@codearenaapp.com>',
            to: options.email,
            subject: options.subject,
            text: options.message,
            html: options.html
        });

        if (error) {
            console.error('Error sending email via Resend:', error);
            return;
        }
        console.log(`Email sent to ${options.email} via Resend`);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};
