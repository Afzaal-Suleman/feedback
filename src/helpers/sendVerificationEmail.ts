import { resend } from '../lib/resend';
import { EmailTemplate } from '../../emails/email-template';
import { ApiResponse } from '@/types/ApiResponse';

export async function sendVerificationEmail(username: string, email: string, verifyCode: string): Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Verify your email',
            react: EmailTemplate({ username, otp: verifyCode }),
        });
        return { success: true, message: "Verification email sent successfully" };
    } catch (emailError) {
        console.log("Error sending verification email:", emailError);
        return { success: false, message: "Failed to send verification email" };
    }
}

