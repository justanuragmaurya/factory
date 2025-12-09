import { Router } from "express";
import { enhancedPrompt, generateCode } from "../../lib/ai";

export const aiRouter = Router()

aiRouter.get("/",(req,res)=>{
    res.json({succes:true,data:{message:"working..."}})
})

aiRouter.post("/enhance",async(req,res)=>{
    const {prompt}:{prompt:string} = req.body;
    return res.json({
        success:true,
        data:{
            prompt: await enhancedPrompt(prompt)
        }
    })
})

aiRouter.post("/generate",async(req,res)=>{
    const {prompt , attachments}:{prompt:string , attachments:string[]} = req.body;

    return res.json({
        success:true,
        data:{
            files:await generateCode(prompt,attachments)
        }
    })
})