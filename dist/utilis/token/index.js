"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.refreshAccessToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dev_config_1 = require("../../config/env/dev.config");
const generateToken = ({ payload, secretKey = dev_config_1.devConfig.JWT_SECRET, options }) => {
    return jsonwebtoken_1.default.sign(payload, secretKey, options);
};
exports.generateToken = generateToken;
const refreshAccessToken = (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return res.status(400).json({ message: "Refresh token is required" });
    }
    const payload = (0, exports.verifyToken)(refreshToken);
    const newAccessToken = (0, exports.generateToken)({
        payload: { _id: payload._id, role: payload.role },
        options: { expiresIn: "1d" },
    });
    res.json({ accessToken: newAccessToken });
};
exports.refreshAccessToken = refreshAccessToken;
const verifyToken = (token, secretKey = dev_config_1.devConfig.JWT_SECRET) => {
    return jsonwebtoken_1.default.verify(token, secretKey);
};
exports.verifyToken = verifyToken;
