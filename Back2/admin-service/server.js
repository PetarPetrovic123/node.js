import dotenv from "dotenv";
dotenv.config();

import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import { sequelize, Signup } from "../shared/models.js";
import { authenticateJWT, authorizeRoles } from "../shared/middleware.js";
import {Op} from "sequelize";

await sequelize.sync();

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({ origin: process.env.FPORTURL, credentials: true }));

// List all users except yourself
app.get("/users", authenticateJWT, authorizeRoles(["admin"]), async (req, res) => {
  const users = await Signup.findAll({ where: { name: { [Op.ne]: req.user.name } } });
  res.json({ users });
});

// Update user role
app.post("/update-role", authenticateJWT, authorizeRoles(["admin"]), async (req, res) => {
  const { id, role } = req.body;
  await Signup.update({ role }, { where: { id } });
  res.json({ message: "Role updated" });
});

app.listen(5003, () => console.log("Admin Service running on 5003"));
