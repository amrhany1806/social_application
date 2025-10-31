import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utilis/token";
import UserRepository from "../DB/model/user/User.Repository";
import {  NotFoundError } from "../utilis";


export const isAuthenticated = () => {

    return async (req: Request, res: Response, next: NextFunction) => {

   
        const token = req.headers.authorization ;
        const payload = verifyToken(token);
        const userRepository = new UserRepository();
        const user = await userRepository.exist({ _id: payload._id },{},{populate:[{path:"friends",select:"fullName firstName lastName"}]})

        if (!user) {
            throw new NotFoundError("user not found");
        }
        req.user = user;
        next();

    }  
      
    }
