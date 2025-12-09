import { Router } from "express";
import { aiRouter } from "./v1/aiRouter";
import { userRouter } from "./v1/userRouter";
import { authMiddleware } from "../middlewares/auth";
import jwt from "jsonwebtoken"

export const v1Router = Router()

v1Router.use("/auth",userRouter)
v1Router.use("/ai",authMiddleware,aiRouter)

v1Router.get("/",(req,res)=>{
    res.json({message:"Working ..."}).status(200);
})

v1Router.get("/me",authMiddleware,(req,res)=>{
    const token:string = req.headers.authorization?.split(" ")[1] as string
    
    if(!token){
        res.json({
            success:false,
            data:{
                message:"Error authetication , please re-login."
            }
        })
    }
    res.json({
        success:true,
        data:{
            user:jwt.decode(token)
        }
    }).status(200);
})