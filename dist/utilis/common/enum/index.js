"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FriendRequestStatus = exports.REACTION = exports.USER_AGENT = exports.GENDER = exports.SYS_ROLE = void 0;
var SYS_ROLE;
(function (SYS_ROLE) {
    SYS_ROLE[SYS_ROLE["admin"] = 0] = "admin";
    SYS_ROLE[SYS_ROLE["user"] = 1] = "user";
})(SYS_ROLE || (exports.SYS_ROLE = SYS_ROLE = {}));
var GENDER;
(function (GENDER) {
    GENDER["MALE"] = "male";
    GENDER["FEMALE"] = "female";
})(GENDER || (exports.GENDER = GENDER = {}));
var USER_AGENT;
(function (USER_AGENT) {
    USER_AGENT[USER_AGENT["local"] = 0] = "local";
    USER_AGENT[USER_AGENT["google"] = 1] = "google";
})(USER_AGENT || (exports.USER_AGENT = USER_AGENT = {}));
var REACTION;
(function (REACTION) {
    REACTION[REACTION["LIKE"] = 0] = "LIKE";
    REACTION[REACTION["CARE"] = 1] = "CARE";
    REACTION[REACTION["LOVE"] = 2] = "LOVE";
    REACTION[REACTION["ANGRY"] = 3] = "ANGRY";
})(REACTION || (exports.REACTION = REACTION = {}));
var FriendRequestStatus;
(function (FriendRequestStatus) {
    FriendRequestStatus["pending"] = "pending";
    FriendRequestStatus["accepted"] = "accepted";
    FriendRequestStatus["rejected"] = "rejected";
})(FriendRequestStatus || (exports.FriendRequestStatus = FriendRequestStatus = {}));
