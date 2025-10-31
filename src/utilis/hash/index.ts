import bcrypt from "bcryptjs";    
export const  generateHash = async (plainText:string)=>{
    return await bcrypt.hash(plainText,10);
} 

export const compareHash = async (password:string,hashPassword:string)=>{
    return await bcrypt.compare(password,hashPassword);
}
