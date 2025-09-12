import dotenv from "dotenv";
dotenv.config();

import express from "express";
import http from "http";
import {Server} from "socket.io";
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

const server = http.createServer(app);
const io = new Server(server,{
  cors:{
    origin:[process.env.FPORTURL,process.env.FPORTURL2],
    methods:["GET","POST"],
    credentials:true
  }
  
})
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

// CSRF token (optional, but you have it already)
app.get("/csrf-token",authenticateJWT,rolesHier("user"), (req, res) => {
  const code = crypto.randomBytes(8).toString("hex");
  req.session.token = code;
  res.json({ code });
});

// SIGNUP
app.post("/signup", async (req, res) => {
  const { username, password, email } = req.body;
  const hash = await bcrypt.hash(password, 12);

  const UsName = validator.escape(username);
  const Email = validator.escape(email);

  const existing = await Signup.findOne({ where: { name: UsName } });
  if (existing) return res.status(409).json({ error: "Username exists" });

  await Signup.create({
    name: UsName,
    password: hash,
    email: Email,
    role: "user",
  });

  res.status(201).json({ message: "Signup successful" });
});

// LOGIN
app.post("/login", limiter, async (req, res) => {
  const { username, password } = req.body;
  const user = await Signup.findOne({ where: { name: username } });
  if (!user) return res.status(401).json({ message: "No such user" });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ message: "Password incorrect" });

  const payload = { id: user.id, name: user.name, role: user.role, date:Date.now() };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "15m" });
  req.session.time = Date.now();
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: false, // ⚠️ true only in production HTTPS
    sameSite: "lax", // 👈 makes it work with localhost:5174
    maxAge: 15 * 60 * 1000,
  });
  io.emit("userStatusChange",{
    username,
    status:"LOGIN",
    timestamp:new Date(),
    ipAddress:req.ip
  })
  await LoginLog.create({
    username:user.name,
    userId:user.id,
    status:"LOGIN",
    ipAddress:req.ip,
    timestamp:new Date()
  })


  res.status(200).json({ message: "Login successful"});
});

// HOME (protected)
app.get("/home",authenticateJWT,rolesHier("user"), async (req, res) => {
  const logIn = await LoginLog.findAll();
  res.json({ user: req.user, log:logIn});
});

// LOGOUT
app.post("/LogOut",authenticateJWT,rolesHier("user"),async (req, res) => {
    const now = Date.now();
    const secPassed = (now-req.user.date) / 1000;
    if(secPassed < 10){
      return res.status(403).json({message:"10 seconds need to pass", secLeft : Math.ceil(10 - secPassed)});
    }
    res.clearCookie("jwt");
    res.clearCookie("connect.sid");

    io.emit("userStatusChange",{
    username:req.user.name,
    status:"LOGOUT",
    timestamp:new Date()
    })

    await LoginLog.update(
    {status:"LOGOUT"},
    {where:{userId:req.user.id}}
  )
    res.status(200).json({ message: "Logged out" });
  
});



io.on("connection",(socket)=>{
  console.log("Frontend connected:", socket.id);

  socket.on("disconnect",()=>{
    console.log("Disconnected:",socket.id);
  })
})

server.listen(5001, "0.0.0.0",() => console.log("✅ Auth Service running on 5001"));
