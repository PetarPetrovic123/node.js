import { Sequelize, DataTypes } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

export const sequelize = new Sequelize("food",process.env.DB_USER,process.env.DB_PASSWORD,{
    host: "localhost",
    dialect: "mysql"
})

export const Signup = sequelize.define("Signup", {
  name: { type: DataTypes.STRING, unique: true },
  password: DataTypes.STRING,
  email: DataTypes.STRING,
  role: { type: DataTypes.STRING, defaultValue: "user" },
  resetCode: DataTypes.STRING,
});
