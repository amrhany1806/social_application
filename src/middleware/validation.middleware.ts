import { NextFunction, Request, Response } from "express"
import {  ZodType } from "zod"
import { BadRequestError } from "../utilis"

export const isValid = (schema: ZodType) => {

    return (req: Request, res: Response, next: NextFunction) => {


        let data = { ...req.body, ...req.params, ...req.query };

        const validate = schema.safeParse(data)
        console.log(validate)

        if (validate.success == false) {

            let errMessage = validate.error.issues.map((issue) => ({
                path: issue.path[0] as string,
                message: issue.message
            }))
            console.log(errMessage)



            throw new BadRequestError("validation error", errMessage)
        }

next()
    }
} 