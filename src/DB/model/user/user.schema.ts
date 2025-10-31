import mongoose, { Schema } from "mongoose";
import { GENDER, SYS_ROLE, USER_AGENT } from "../../../utilis/common/enum";
import { IUser } from "../../../utilis/common/interface";
import { sendEmail } from "../../../utilis/email";

export const userSchema = new mongoose.Schema<IUser>({


    firstName: { type: String, maxLength: 20, minLength: 2, required: true, trim: true },
    lastName: { type: String, maxLength: 20, minLength: 2, required: true, trim: true },
    email: { type: String, lowercase: true, unique: true, required: true, trim: true },
    password: {
        type: String, required: function () {
            if (this.userAgent == USER_AGENT.local) {
                return true;
            }
            return false;
        }
    },
    credentialsUpdateAt: Date,
    phoneNumber: String,
    role: { type: Number, enum: SYS_ROLE, default: SYS_ROLE.user },
    gender: { type: String, enum: GENDER },
    userAgent: { type: Number, enum: USER_AGENT, default: USER_AGENT.local },
    otp: { type: String },
    otpExpiry: { type: Date },
    isVerified: { type: Boolean, default: false },
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    twoFactorEnabled: { type: Boolean, default: false },
    twoFactorOtp: { type: String },
    twoFactorOtpExpiry: { type: Date },
    blockUsers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    blockedBy: [{ type: Schema.Types.ObjectId, ref: "User" }],



}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

userSchema.virtual("fullName").get(function () {
    return this.firstName + " " + this.lastName;
}).set(function (value: string) {
    const [fName, lName] = value.split(" ");
    this.firstName = fName as string;
    this.lastName = lName as string;
});


userSchema.pre("save", async function (next) {

    if (this.userAgent != USER_AGENT.google || this["isNew"] == true) {
        await sendEmail({ to: this.email, subject: "Verify your email", html: `<h1>your otp is ${this.otp}</h1>` })

    }

})