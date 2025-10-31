"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForbiddenError = exports.BadRequestError = exports.NotAuthorizedError = exports.NotFoundError = exports.ConflictError = exports.AppError = void 0;
class AppError extends Error {
    statusCode;
    errorDetails;
    constructor(message, statusCode, errorDetails) {
        super(message);
        this.statusCode = statusCode;
        this.errorDetails = errorDetails;
    }
}
exports.AppError = AppError;
class ConflictError extends AppError {
    constructor(message, errorDetails) {
        super(message, 409, errorDetails);
    }
}
exports.ConflictError = ConflictError;
class NotFoundError extends AppError {
    constructor(message, errorDetails) {
        super(message, 404, errorDetails);
    }
}
exports.NotFoundError = NotFoundError;
class NotAuthorizedError extends AppError {
    constructor(message, errorDetails) {
        super(message, 401, errorDetails);
    }
}
exports.NotAuthorizedError = NotAuthorizedError;
class BadRequestError extends AppError {
    constructor(message, errorDetails) {
        super(message, 400, errorDetails);
    }
}
exports.BadRequestError = BadRequestError;
class ForbiddenError extends AppError {
    constructor(message, errorDetails) {
        super(message, 403, errorDetails);
    }
}
exports.ForbiddenError = ForbiddenError;
