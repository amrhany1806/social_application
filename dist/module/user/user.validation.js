"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.confrimEmail = exports.updateEmail = exports.UpdatePassword = exports.updateBasicInfo = void 0;
const zod_1 = require("zod");
const utilis_1 = require("../../utilis");
exports.updateBasicInfo = zod_1.z.object({
    fullName: zod_1.z.string().optional(),
    phoneNumber: zod_1.z.string().optional(),
    gender: zod_1.z.enum(utilis_1.GENDER)
}).strict();
exports.UpdatePassword = zod_1.z.object({
    oldPassword: zod_1.z.string(),
    newPassword: zod_1.z.string(),
    confirmPassword: zod_1.z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "password is not match",
    path: ["confirmPassword"]
});
exports.updateEmail = zod_1.z.object({
    newEmail: zod_1.z.email()
});
exports.confrimEmail = zod_1.z.object({
    newEmail: zod_1.z.email(),
    otp: zod_1.z.string()
});
