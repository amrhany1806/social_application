import { Socket } from "socket.io";
import { verifyToken } from "../../utilis/token";
import UserRepository from "../../DB/model/user/User.Repository";
import { NotFoundError } from "../../utilis";

export const socketAuth  = async(socket:Socket, next:Function)=>{
       try {
         const {authorization} = socket.handshake.auth;
       const payload =  verifyToken(authorization);

       const Userrepository = new UserRepository();
      const user =  await Userrepository.getOne({_id:payload._id})
      if (!user) {
        throw new NotFoundError("user not found")
      }
      socket.data.user = user
      next();
       
       } catch (error) {
       next(error) 
       }
}