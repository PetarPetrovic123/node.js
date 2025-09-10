import { Sequelize, DataTypes } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

export const sequelize = new Sequelize("food",process.env.DB_USER,process.env.DB_PASSWORD,{
    host: "localhost",
    dialect: "mysql"
})

export const Signup = sequelize.define("Signup", {
  name: { type: DataTypes.STRING },
  password: DataTypes.STRING,
  email: DataTypes.STRING,
  role: { type: DataTypes.STRING, defaultValue: "user" },
  resetCode: DataTypes.STRING,
  department:DataTypes.STRING
});

export const LoginLog = sequelize.define("LoginLog",{
  username:{type:DataTypes.STRING},
  userId:{type:DataTypes.INTEGER, allowNull:false},
  status:{
    type:DataTypes.ENUM("LOGIN","LOGOUT"),
    allowNull:false
  },
  ipAddress:{type:DataTypes.STRING},
  timestamp:{
    type:DataTypes.DATE,
    defaultValue:DataTypes.NOW
  }
})
