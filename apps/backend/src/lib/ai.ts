import OpenAI from "openai"
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";

const ai = new OpenAI({
    apiKey:process.env.AI_API_KEY,
    baseURL: 'https://openrouter.ai/api/v1'
})

const generateFileResponse = z.object({
    files: z.array(
        z.object({
          filename: z.string(),
          content: z.string(),
        })
    )
})

const enhancePromptType = z.object({
    prompt:z.string()
})

export const generateCode = async(prompt:string , attachments: string[])=>{
    const response = await ai.responses.parse({
        model:"x-ai/grok-code-fast-1",
        input:[
            {
                role:"system",
                content:"Your are ai vibe coding agent and your job is to create generate code array of files for a react app based on the user prompt. the code files should be in format of a json {files:[{filename eg src/index.js : file's content like import React newline char and the other code and soo on},{file2:content } and soo on etc.]}"
            },
            {
                role:"user",
                content:prompt
            }
        ],
        text:{
            format:zodTextFormat(generateFileResponse,"files")
        }
    })
    return response.output_parsed?.files;
}

export const enhancedPrompt = async(prompt:string)=>{
    const response = await ai.responses.parse({
        model:"x-ai/grok-code-fast-1",
        input:[
            {
                role:"system",
                content:"Your are ai vibe coding agent and your job is to create and craft beutifull prompts for a ai worker agent which will generate code files for a react app based on the user prompt."
            },
            {
                role:"user",
                content:prompt
            }
        ],
        text:{
            format:zodTextFormat(enhancePromptType,"prompt")
        }
    })
    return response.output_parsed?.prompt
}