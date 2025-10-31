import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import { devConfig } from "../../config/env/dev.config";
import { Request, Response } from "express";

export const generateToken = ({ payload, secretKey = devConfig.JWT_SECRET, options }: { payload: object; secretKey?: string; options?: SignOptions; }) => {
    return jwt.sign(payload, secretKey as string, options)

}

export const refreshAccessToken = (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ message: "Refresh token is required" });
  }

 
    const payload = verifyToken(refreshToken); 
    const newAccessToken = generateToken({
      payload: { _id: payload._id, role: payload.role },
      options: { expiresIn: "1d" },
    });

    res.json({ accessToken: newAccessToken });
  
};


export const verifyToken = (token: string, secretKey = devConfig.JWT_SECRET as string) => {
    return jwt.verify(token, secretKey) as JwtPayload
}