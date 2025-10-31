"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tags = exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dev_config_1 = require("../../config/env/dev.config");
const sendEmail = async (mailOptions) => {
    const transporter = nodemailer_1.default.createTransport({
        service: "gmail",
        auth: {
            user: dev_config_1.devConfig.EMAIL_USER,
            pass: dev_config_1.devConfig.PASSWORD_USER
        }
    });
    mailOptions.from = `Social-app <${dev_config_1.devConfig.EMAIL_USER}>`;
    await transporter.sendMail(mailOptions);
};
exports.sendEmail = sendEmail;
const Tags = async (mailOptions) => {
    const transporter = nodemailer_1.default.createTransport({
        service: "gmail",
        auth: {
            user: dev_config_1.devConfig.EMAIL_USER,
            pass: dev_config_1.devConfig.PASSWORD_USER
        }
    });
    mailOptions.from = `Social-app <${dev_config_1.devConfig.EMAIL_USER}>`;
    await transporter.sendMail(mailOptions);
};
exports.Tags = Tags;
