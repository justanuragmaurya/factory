import dotenv from "dotenv"
dotenv.config()

import express from "express"
import { v1Router } from "./routers";
import { authMiddleware } from "./middlewares/auth";

const app = express();

app.use(express.json());
app.use("/v1",v1Router);

app.listen(process.env.PORT || 8080,()=>{
    console.log("Running the server on PORT : " + process.env.PORT || 8080)
})