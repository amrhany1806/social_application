import mongoose from "mongoose";
import { devConfig } from "../config/env/dev.config";

export const connectDB = async () => {
  
      await  mongoose.connect(devConfig.DB_URL as string).then(()=>{
        console.log("Connected to DB");
      }).catch((error)=>{
        console.log("fail to connect to DB");
      })
        
     
    
}
