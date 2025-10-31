"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValid = void 0;
const utilis_1 = require("../utilis");
const isValid = (schema) => {
    return (req, res, next) => {
        let data = { ...req.body, ...req.params, ...req.query };
        const validate = schema.safeParse(data);
        console.log(validate);
        if (validate.success == false) {
            let errMessage = validate.error.issues.map((issue) => ({
                path: issue.path[0],
                message: issue.message
            }));
            console.log(errMessage);
            throw new utilis_1.BadRequestError("validation error", errMessage);
        }
        next();
    };
};
exports.isValid = isValid;
