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
import { sequelize, Signup } from "../shared/models.js";
import { authenticateJWT } from "../shared/middleware.js";

await sequelize.sync({ alter: true });

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FPORTURL, // http://localhost:5174
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
app.get("/csrf-token", (req, res) => {
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

  const payload = { id: user.id, name: user.name, role: user.role };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "15m" });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: false, // ⚠️ true only in production HTTPS
    sameSite: "lax", // 👈 makes it work with localhost:5174
    maxAge: 15 * 60 * 1000,
  });

  res.status(200).json({ message: "Login successful" });
});

// HOME (protected)
app.get("/home", authenticateJWT, async (req, res) => {
  res.json({ user: req.user });
});

// LOGOUT
app.post("/LogOut", (req, res) => {
  res.clearCookie("jwt");
  res.clearCookie("connect.sid");
  res.status(200).json({ message: "Logged out" });
});

app.listen(5001, () => console.log("✅ Auth Service running on 5001"));
