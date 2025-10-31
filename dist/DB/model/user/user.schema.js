"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSchema = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const enum_1 = require("../../../utilis/common/enum");
const email_1 = require("../../../utilis/email");
exports.userSchema = new mongoose_1.default.Schema({
    firstName: { type: String, maxLength: 20, minLength: 2, required: true, trim: true },
    lastName: { type: String, maxLength: 20, minLength: 2, required: true, trim: true },
    email: { type: String, lowercase: true, unique: true, required: true, trim: true },
    password: {
        type: String, required: function () {
            if (this.userAgent == enum_1.USER_AGENT.local) {
                return true;
            }
            return false;
        }
    },
    credentialsUpdateAt: Date,
    phoneNumber: String,
    role: { type: Number, enum: enum_1.SYS_ROLE, default: enum_1.SYS_ROLE.user },
    gender: { type: String, enum: enum_1.GENDER },
    userAgent: { type: Number, enum: enum_1.USER_AGENT, default: enum_1.USER_AGENT.local },
    otp: { type: String },
    otpExpiry: { type: Date },
    isVerified: { type: Boolean, default: false },
    friends: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' }],
    twoFactorEnabled: { type: Boolean, default: false },
    twoFactorOtp: { type: String },
    twoFactorOtpExpiry: { type: Date },
    blockUsers: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "User" }],
    blockedBy: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "User" }],
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });
exports.userSchema.virtual("fullName").get(function () {
    return this.firstName + " " + this.lastName;
}).set(function (value) {
    const [fName, lName] = value.split(" ");
    this.firstName = fName;
    this.lastName = lName;
});
exports.userSchema.pre("save", async function (next) {
    if (this.userAgent != enum_1.USER_AGENT.google || this["isNew"] == true) {
        await (0, email_1.sendEmail)({ to: this.email, subject: "Verify your email", html: `<h1>your otp is ${this.otp}</h1>` });
    }
});
