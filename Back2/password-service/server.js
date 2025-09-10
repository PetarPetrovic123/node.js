import dotenv from "dotenv";
dotenv.config();

import express from "express";
import bcrypt from "bcrypt";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import nodemailer from "nodemailer";
import crypto from "crypto";
import cors from "cors";
import { sequelize, Signup } from "../shared/models.js";
import { authenticateJWT } from "../shared/middleware.js";

await sequelize.sync();

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({ origin: [process.env.FPORTURL, process.env.FPORTURL2], credentials: true }));

app.post("/check-old", authenticateJWT, async (req, res) => {
  const { oldPassword } = req.body;
  const user = await Signup.findByPk(req.user.id);
  if (!user) return res.json({ valid: false });

  const ok = await bcrypt.compare(oldPassword, user.password);
  res.json({ valid: ok });
});

app.post("/change", authenticateJWT, async (req, res) => {
  const { password } = req.body;
  if (!password || password.trim() === "") {
    return res.status(400).json({ message: "Password empty" });
  }
  const hash = await bcrypt.hash(password, 10);
  await Signup.update({ password: hash }, { where: { id: req.user.id } });
  res.status(200).json({ message: "Password updated" });
});

app.post("/reset-email", authenticateJWT, async (req, res) => {
  const code = crypto.randomInt(100000, 999999).toString();
  const user = await Signup.findByPk(req.user.id);
  if (!user) return res.status(404).json({ error: "User not found" });

  user.resetCode = code;
  await user.save();

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: { user: "srdjantt583@gmail.com", pass: "xqvexqeliswccbjn" }
  });

  await transporter.sendMail({
    from: "srdjantt583@gmail.com",
    to: user.email,
    subject: "Password reset",
    text: `Your reset code is ${code}.`
  });

  res.json({ message: "Reset code sent" });
});

app.post("/reset-code", authenticateJWT, async (req, res) => {
  const { code } = req.body;
  const user = await Signup.findByPk(req.user.id);
  if (!user) return res.status(404).json({ valid: false });
  res.json({ valid: user.resetCode === code });
});

app.listen(5002,"0.0.0.0", () => console.log("Password Service running on 5002"));
