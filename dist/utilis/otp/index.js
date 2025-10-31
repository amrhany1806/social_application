"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateExpiryDate = exports.generateOtp = void 0;
const generateOtp = () => {
    return Math.floor(Math.random() * 99999 + 10000);
};
exports.generateOtp = generateOtp;
const generateExpiryDate = (time) => {
    return Date.now() + time;
};
exports.generateExpiryDate = generateExpiryDate;
