// import nodemailer from "nodemailer";
// import logger from "./logger";
// import { envConfigs } from "./envconfig";

// const transporter = nodemailer.createTransport({
//     host: envConfigs.smtp_host,
//     port: Number(envConfigs.smtp_port || 587),
//     secure: false, // true only for port 465
//     auth: {
//         user: envConfigs.smtp_user,
//         pass: envConfigs.smtp_pass,
//     },
// });

// transporter.verify((error, success) => {
//     if (error) {
//         logger.error("❌ Email Transport Error:", error);
//     } else {
//         logger.info("📧 Email Server Ready");
//     }
// });

// export default transporter;
