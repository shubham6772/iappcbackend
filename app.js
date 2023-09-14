import express from 'express';
import { config } from 'dotenv';
import { errorMiddleware } from './middlewares/error.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

config({
    path : "./data/.env",
})

export const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials : true,
    methods: ["GET", "POST", "PUT"],
    origin: [process.env.FRONTEND_URI_1, process.env.FRONTEND_URI_2]
}))

import user from "./routes/user.js";


app.use("/api/v1/user", user);

app.use(errorMiddleware);


