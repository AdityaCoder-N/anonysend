import { resend } from "@/lib/resend";
import VerificationEmail from "@/emails/VerificationEmail";

import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
    email:string,
    username:string,
    verifyCode:string
) : Promise<ApiResponse>{

    try {
        const response = await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: 'Anonysend | Verification code',
            react: VerificationEmail({username,otp:verifyCode}),
        });
        console.log(response);

        return {success:true,message:"Verification email sent Successfully"}
    } catch (error) {
        console.error("Error sending verification email : ",error);
        return {success:false,message:"Failed to send Verification email"}
    }
}