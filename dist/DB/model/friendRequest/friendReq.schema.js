"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.friendRequestSchema = void 0;
const mongoose_1 = require("mongoose");
const utilis_1 = require("../../../utilis");
exports.friendRequestSchema = new mongoose_1.Schema({
    from: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    to: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: Object.values(utilis_1.FriendRequestStatus), default: utilis_1.FriendRequestStatus.pending }
});
