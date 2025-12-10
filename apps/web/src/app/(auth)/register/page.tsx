"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import jwt from "jsonwebtoken"

export default function RegisterPage() {
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  async function handleRegister() {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/auth/signup`,{
        email:emailRef.current?.value,
        password:passwordRef.current?.value
    })
    
    const {success , data} = response.data;

    if(success){
        window.localStorage.setItem("token",data.token);
        console.log(jwt.decode(data.token))
    }else{
        console.log("Error Signin in")
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-6 p-8">
        <h1 className="text-2xl font-bold text-center">Register</h1>
        
        <div className="space-y-4">
          
          <input
            ref={emailRef}
            type="email"
            placeholder="Email"
            className="w-full rounded-md border px-4 py-2 outline-none focus:ring-2 focus:ring-primary"
          />
          
          <input
            ref={passwordRef}
            type="password"
            placeholder="Password"
            className="w-full rounded-md border px-4 py-2 outline-none focus:ring-2 focus:ring-primary"
          />
          
          <Button onClick={handleRegister} className="w-full">
            Register
          </Button>
        </div>
      </div>
    </div>
  );
}
