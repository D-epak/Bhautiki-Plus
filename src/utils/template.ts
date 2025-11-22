import { envConfigs } from "../config/envconfig";
import logger from "../config/logger";
import transporter from "../config/mailer";


export const sendEmail = async (
    to: string,
    otp: string,
    subject = "Your Verification OTP"
) => {
    try {
        const mailOptions = {
            from: envConfigs.from_email,
            to,
            subject,
            text: `Your OTP is: ${otp}`,
            html: `
        <div style="background:#f6f7fb; padding:20px; font-family:Arial, sans-serif;">
            <div style="
                max-width:500px;
                margin:0 auto;
                background:#ffffff;
                border-radius:10px;
                padding:25px;
                box-shadow:0 4px 8px rgba(0,0,0,0.05);
            ">
                <h2 style="text-align:center; color:#333; margin-bottom:20px;">
                    🔐 Email Verification
                </h2>

                <p style="font-size:15px; color:#555;">
                    Hello,
                    <br/><br/>
                    Please use the One-Time Password (OTP) below to complete your verification.
                </p>

                <div style="
                    text-align:center;
                    margin:30px 0;
                ">
                    <div style="
                        display:inline-block;
                        background:#4f46e5;
                        color:#fff;
                        padding:12px 25px;
                        border-radius:8px;
                        font-size:28px;
                        letter-spacing:4px;
                        font-weight:bold;
                    ">
                        ${otp}
                    </div>
                </div>

                <p style="font-size:14px; color:#666;">
                    This OTP is valid for <b>5 minutes</b>.  
                    If you did not request this verification, please ignore this email.
                </p>

                <hr style="border:none; border-top:1px solid #eee; margin:25px 0;" />

                <p style="font-size:12px; color:#999; text-align:center;">
                    © ${new Date().getFullYear()} Admission Portal.  
                    This is an automated message — please do not reply.
                </p>
            </div>
        </div>
        `,
        };

        const info = await transporter.sendMail(mailOptions);

        logger.info(`📧 Email sent to: ${to} | MessageId: ${info.messageId}`);

        return true;

    } catch (error: any) {
        logger.error("❌ Email sending failed:", error.message);
        throw new Error("Failed to send email");
    }
};
