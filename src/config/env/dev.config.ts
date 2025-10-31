import { config } from "dotenv";
config();

export const devConfig = {
  
    PORT : process.env.PORT,

DB_URL : process.env.DB_URL,

//cloud

   API_KEY : process.env.API_KEY,
    API_SECRET : process.env.API_SECRET,
    CLOUD_NAME : process.env.CLOUD_NAME,


//email

EMAIL_USER : process.env.EMAIL_USER,

PASSWORD_USER : process.env.PASSWORD_USER,

JWT_SECRET : process.env.JWT_SECRET,

};
