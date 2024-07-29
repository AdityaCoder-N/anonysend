import nodemailer from 'nodemailer'
import Mail from 'nodemailer/lib/mailer'
import SMTPTransport from 'nodemailer/lib/smtp-transport'

const transport = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: process.env.NODE_ENV!=='development',
    auth:{
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD
    },
    debug:true,
    logger: true
} as SMTPTransport.Options)

type SendEmailDto={
    email:Mail.Address,
    username:string,
    verifyCode:string
}

export const sendEmail = async (dto:SendEmailDto)=>{
    const {email, username, verifyCode} = dto;
    
    try {
        const response = await transport.sendMail({
            from:'negiaditya1234@gmail.com',
            to:email,
            subject:'Anonysend | Verification code',
            html:`
            <HTML>
                <HEAD>
                    <title>Verification Code</title>
                </HEAD>
                <BODY>
                    <h2>Hello, ${username}</h2>
                    <br/>
                    <p>Thank you for Registering. Please use the following verification code to complete your registration : </p>
                    <h1>${verifyCode}</h1>
                    <br/><br/>
                    <p>If you did not request this code, Please ignore this mail.</p>
                </BODY>
            </HTML>
            `
        })
        
        return {success:true,message:"Verification email sent Successfully"}
        
    } catch (error) {
        console.log(error);
        return {success:false,message:"Error occured while sending email."}
    }
    
}