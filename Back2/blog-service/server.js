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
import { sequelize, Signup, LoginLog, Posts, Comment } from "../shared/models.js";
import { authenticateJWT,rolesHier } from "../shared/middleware.js";
import { Sequelize } from "sequelize";

await sequelize.sync();

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
    origin:[process.env.FPORTURL, process.env.FPORTURL2, process.env.FPORTURL3], 
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

app.post("/NewPost",authenticateJWT,rolesHier("user"), async(req,res)=>{
  const {title, content} = req.body;
  const post = await Posts.create({
    username:req.user.name,
    title:title,
    content:content,
    timeMade:new Date()
  })
  res.status(201).json(post)
})

app.get("/Posts",authenticateJWT,async(req,res)=>{
  const result = await Posts.findAll({
    order:[
      [Sequelize.literal("likes - dislikes"), "DESC"]
    ]
  });
  res.json({result});
})

app.get("/MyPosts",authenticateJWT,rolesHier("user"),async(req,res)=>{
  const result = await Posts.findAll({where:{username:req.user.name}});
  res.json({result});
})

app.get("/editP/:id",async(req,res)=>{
  const id = req.params.id;
  const post = await Posts.findOne({where:{id:id}});
  res.json({post});
})

app.put("/editP/:id",rolesHier("user"),async(req,res)=>{
  const {title, content} = req.body;
  const id = req.params.id;
  await Posts.update({title,content},{where:{id:id}});
  res.status(200).json({message:"All good!"})
})

app.get("/post/:id",async(req,res)=>{
  const id = req.params.id;
  const post = await Posts.findOne({
    where:{id:id},
    include:[
      {
        model:Comment,
        include:[
          {
            model:Signup,
            attributes:["name"]
          }
        ],
        separate:true,
        order:[[sequelize.literal("likes - dislikes"),"DESC"]]
      }
    ]
  });
  console.log(post);
  res.json({post});
})

app.post("/editP",rolesHier("user"),(req,res)=>{
  const {user} = req.body;
  req.session.user = user;
  res.json({message:"Post saved in a session!"})
})

app.post("/createComment",authenticateJWT,async(req,res)=>{
  const {id, content} = req.body;

  const comment = await Comment.create({
    username:req.user.name,
    content:content,
    userId:req.user.id,
    postId:id
  })
  const fullComment = await Comment.findByPk(comment.id,{
    include:[{model:Signup, attributes:["id","name"]}]
  });
  io.emit("comment",fullComment);

  console.log(comment);
  res.status(200).json({message:"Comment saved!"});
})

app.post("/post/:id/like",async(req,res)=>{
  const id = req.params.id;
  const post = await Posts.findByPk(id);

  post.likes += 1;
  await post.save();

  io.emit("like",post);
  res.json({post});
})

app.post("/post/:id/dislike",async(req,res)=>{
  const id = req.params.id;
  const post = await Posts.findByPk(id);

  post.dislikes += 1;
  await post.save();

  io.emit("like",post);
  res.json({post});
})

app.post("/post/:id/Clike",async(req,res)=>{
  const id = req.params.id;
  const comment = await Comment.findByPk(id);

  comment.likes += 1;
  await comment.save();

  io.emit("Clike",comment);
  res.json({comment});
})

app.post("/post/:id/CDislike",async(req,res)=>{
  const id = req.params.id;
  const comment = await Comment.findByPk(id);

  comment.dislikes += 1;
  await comment.save();

  io.emit("Clike",comment);
  res.json({comment});
})


io.on("connection",(socket)=>{
  console.log("Frontend connected:", socket.id);

  socket.on("disconnect",()=>{
    console.log("Disconnected:",socket.id);
  })
})
server.listen(5004,"0.0.0.0",()=>{
    console.log("Blog service working on the port 5004!")
});