import dotenv from "dotenv";
dotenv.config();

import express from "express";
import bodyParser from "body-parser";
import bcrypt from "bcrypt";
import validator from "validator";
import rateLimit from "express-rate-limit";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import session from "express-session";
import crypto from "crypto";
import cors from "cors";
import { sequelize, Signup, LoginLog, Posts } from "../shared/models.js";
import { authenticateJWT,rolesHier } from "../shared/middleware.js";

await sequelize.sync({ alter: true });

const app = express();

app.use(bodyParser.json());
app.use(cookieParser());
app.use(
  cors({
    origin:[process.env.FPORTURL, process.env.FPORTURL2], // http://localhost:5174
    credentials: true,
  })
);
app.use(
  session({
    secret: "auth-secret",
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, secure: false, sameSite: "lax" },
  })
);

const limiter = rateLimit({
  windowMs: 1000 * 60 * 15,
  max: 50,
  statusCode: 429,
});

app.post("/NewPost",authenticateJWT, async(req,res)=>{
  const {title, content} = req.body;
  const post = await Posts.create({
    username:req.user.name,
    title:title,
    content:content,
    timeMade:new Date()
  })
})

app.listen(5004,"0.0.0.0",()=>{
    console.log("Blog service working on the port 5004!")
})