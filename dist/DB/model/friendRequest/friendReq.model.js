"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.friendRequest = void 0;
const mongoose_1 = require("mongoose");
const friendReq_schema_1 = require("./friendReq.schema");
exports.friendRequest = (0, mongoose_1.model)("friendRequest", friendReq_schema_1.friendRequestSchema);
