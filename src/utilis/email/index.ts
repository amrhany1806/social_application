import nodemailer from "nodemailer";
import { devConfig } from "../../config/env/dev.config";
import { SendMailOptions } from "nodemailer";

export const sendEmail = async (mailOptions: SendMailOptions) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: devConfig.EMAIL_USER,
            pass: devConfig.PASSWORD_USER
        }
    })
mailOptions.from = `Social-app <${devConfig.EMAIL_USER}>`

    await transporter.sendMail(mailOptions);
}
export const Tags = async (mailOptions: SendMailOptions) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: devConfig.EMAIL_USER,
            pass: devConfig.PASSWORD_USER
        }
    })
mailOptions.from = `Social-app <${devConfig.EMAIL_USER}>`

    await transporter.sendMail(mailOptions);
}

