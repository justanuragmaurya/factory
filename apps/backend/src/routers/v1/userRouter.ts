import { Router } from "express";
import prisma from "@factory/db"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export const userRouter = Router()

userRouter.get("/",(req,res)=>{
    res.json({message:"Working ..."}).status(200);
})

userRouter.post("/signup",async(req,res)=>{
    const { email , password} = req.body;
    const db = prisma;
    
    let hashedPassword:string = "";
    
    if(!email || !password){
        return res.json({
            success:false,
            data:{
                message:"Please enter all the fields including the ID and the Password"
            }
        })
    }

    const checkUser = await db.user.findUnique({
        where:{
            email:email
        }
    })

    if(checkUser){
        return res.json({
            success:false,
            data:{
                message:"User already registered , please sign in instead"
            }
        })
    }

    bcrypt.hash(password,10,async(err,hash)=>{
        if(err){
            return res.json({
                success:false,
                data:{
                    message:"Please try again : Error hashing the password"
                }
            })
        }
        
        const user = await db.user.create({
            data:{
                email:email,
                password: hash
            }
        })

        const token = jwt.sign(user, process.env.AUTH_SECRET! ,{expiresIn:'30d'})

        res.json({
            success:true,
            data:{
                token:token,
                user:user
            }
        })
    })
})

userRouter.post("/signin",async(req,res)=>{
    const { email , password } = req.body;

    if(!email || !password){
        return res.json({
            success:false,
            data:{
                message:"Please enter all the fields including the ID and the Password"
            }
        })
    }
    const db = prisma;
    
    const user = await db.user.findFirst({
        where:{
            email:email
        }
    })

    if(!user){
        return res.json({
            success:false,
            data:{
                message:"User not found , please signup first."
            }
        })
    }

    const verified = await bcrypt.compare(password,user?.password!)

    if(!verified){
        res.json({
            success:true,
                data:{
                    message:"Please check your email/password again."
                }
        })
    }
    res.json({
        success:true,
        data:{
            token: jwt.sign(user,process.env.AUTH_SECRET!,{expiresIn:'30d'})
        }
    })
})