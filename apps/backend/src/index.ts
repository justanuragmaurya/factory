import dotenv from "dotenv"
dotenv.config()

import express from "express"
import { v1Router } from "./routers";
import cors from "cors"

const app = express();

app.use(cors())
app.use(express.json());
app.use("/v1",v1Router);

app.listen(process.env.PORT || 8080,()=>{
    console.log("Running the server on PORT : " + process.env.PORT || 8080)
})