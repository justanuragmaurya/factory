import jwt from "jsonwebtoken"
import type { NextFunction, Request, Response } from "express";
export const authMiddleware = (req:Request,res:Response,next:NextFunction) =>{
    const token = req.headers.authorization?.split(" ")[1];

    if(!token){
        return res.json({
            success:false,
            data:{
                message:"Please login to continue"
            }
        })
    }
    try{
        jwt.verify(token,process.env.AUTH_SECRET!)
        next()
    }catch(e){
        res.json({
            success:false,
            data:{
                message:"Please logout and login again to continue."
            }
        })
    }
}