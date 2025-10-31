"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerSchema = void 0;
const zod_1 = require("zod");
const enum_1 = require("../../utilis/common/enum");
exports.registerSchema = zod_1.z.object({
    fullName: zod_1.z.string().min(3).max(20),
    email: zod_1.z.email(),
    password: zod_1.z.string(),
    phoneNumber: zod_1.z.string().min(11).max(11),
    gender: zod_1.z.enum(enum_1.GENDER),
    userAgent: zod_1.z.enum(enum_1.USER_AGENT),
});
