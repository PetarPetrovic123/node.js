import dotenv from "dotenv";
dotenv.config();

import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
const app = express();
import session from "express-session";
import {sequelize,Signup} from "./models.js";
await sequelize.sync({alter:true});
import bcrypt from "bcrypt";
import validator from 'validator';
import rateLimit from "express-rate-limit";
import crypto, { Sign } from "crypto";
import nodemailer from "nodemailer";



app.use(cors({
    origin:process.env.FPORT,
    credentials: true           // important: allow cookies cross-origin
}));
const limiter = rateLimit({
    windowMs:1000 * 60 * 15,
    max:50,
    statusCode: 429
})
app.use(bodyParser.json());
app.use(session({
  secret: "your-secret-key",   // change this
  resave: false,
  saveUninitialized: false,
  cookie: { 
    httpOnly:true,
    secure:false,
    sameSite:"strict",
    maxAge:1000 * 60 * 15
}    // set true in production with HTTPS
}));

const isLogged = (req,res,next)=>{
    if(req.session.username){
        next()
    }else{
        res.status(411).json({message:"Unauthorized access"});
    }
}

app.get("/csrf-token",(req,res)=>{
    const code =  crypto.randomBytes(8).toString("hex");
    req.session.token = code;       // save into the session
    res.json({code});
})


app.post("/signup", async(req,res)=>{
    const {username,password,email} = req.body;
    const saltRounds = 12;
    const HshdPwd = await bcrypt.hash(password, saltRounds);
    const UsName = validator.escape(username);
    const Email = validator.escape(email);

    const existing = await Signup.findOne({ where: { name: UsName } });
    if (existing) {
      return res.status(409).json({ error: "Username already exists" });
    }
    await Signup.create({
        name:UsName,
        password:HshdPwd,
        email:Email
    })
    res.status(201).json({ message: "Signup successful" });
})

app.post("/login",limiter,async(req,res)=>{
    const {username,password} = req.body;
    const UName = await Signup.findOne({
        where:{name:username},
        attributes:["name","password"]
    })
    if(UName){
        const Pass = UName.password;
        const isMatch = await bcrypt.compare(password,Pass);
        if(isMatch){
            req.session.username = UName.name;
            res.status(201).json({message:"Signup successful"});
        }else{
            res.status(401).json({message:"The password doesn't match the username!"});
        }
    }else{
        return res.status(401).json({message:"There is no matching username!"})
    }
})

app.get("/home",isLogged, async(req,res)=>{
    const users = req.session.username;
    res.json({users});
})

app.get("/NewPost",isLogged,(req,res)=>{
    res.json({ message: "You are authorized!" });
})

app.post("/LogOut",(req,res)=>{
    try{
        const {csrfT} = req.body;

        if(csrfT === req.session.token){
            req.session.destroy(err => {
                if (err) {
                return res.status(500).send("Could not log out, try again.");
                }

                // Clear the cookie in the browser
                res.clearCookie("connect.sid", {
                path: "/"   // must match the cookie path
                });
                res.status(201).json({message:"Logged out!"});
            });
        }
    }catch(e){
        res.status(400).json({message:"Kurcina majmune!!!"});

    }
    
    
})

app.post("/Pass", isLogged, async (req, res) => {
  const { oldPassword } = req.body;
  const user = await Signup.findOne({
    where: { name: req.session.username },
    attributes: ["password"]
  });
  if (!user) return res.json({ valid: false });

  const ok = await bcrypt.compare(oldPassword, user.password);
  res.json({ valid: ok });
});

app.post("/ChPwd",async(req,res)=>{
    const {password} = req.body;
    if(!password || password.trim() === ""){
        return res.status(400).json({ message: "Password cannot be empty" });;
    }
    const hashPass = await bcrypt.hash(password,10);

    const [updated] = await Signup.update(
        {password:hashPass},
        {where:{name:req.session.username}}
    )

    if(updated){
        res.status(201).json({message:"Password updated sucessfully!"})
    }

})

app.post("/Email",async(req,res)=>{
    const code = crypto.randomInt(100000, 999999).toString();
    const user = await Signup.findOne(
        {where:
        {name:req.session.username}
        }
    );
    user.resetCode = code;
    await user.save();

    const email = user.email;

    const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "srdjantt583@gmail.com",
      pass: "xqvexqeliswccbjn"
    }
    });

    await transporter.sendMail({
        from: 'srdjantt583@gmail.com',
        to: email,
        subject: "Password reset",
        text: `Your reset code is ${code}.`
    });
    res.json({ message: "Reset code sent!", code:code });
    
})

app.post("/ChngPwdCode",async(req,res)=>{
    const { Code } = req.body;

  const user = await Signup.findOne({
    where: { name: req.session.username }
  });

  if (!user) {
    return res.status(404).json({ valid: false });
  }

  if (user.resetCode === Code) {
    return res.json({ valid: true });
  } else {
    return res.json({ valid: false });
  }
})

app.listen(process.env.BPORT,(req,res)=>{
    console.log("Listening on port 5000!");
})