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

export const Posts = sequelize.define("Posts",{
  title:DataTypes.STRING,
  username:DataTypes.STRING,
  content:DataTypes.STRING,
  timeMade:DataTypes.DATE,
  userId:DataTypes.INTEGER
})

export const Comment = sequelize.define("Comments",{
  username:DataTypes.STRING,
  content:DataTypes.STRING,
  createdAt:{
    type:DataTypes.DATE,
    defaultValue:new Date()
  },
  updatedAt:{
    type:DataTypes.DATE,
    defaultValue:new Date()
  },
  userId:DataTypes.INTEGER,
  postId:DataTypes.INTEGER
})

Signup.hasMany(Posts, {foreignKey:"userId"});
Posts.belongsTo(Signup, {foreignKey:"userId"});

Signup.hasMany(Comment, {foreignKey:"userId"});
Comment.belongsTo(Signup, {foreignKey:"userId"});

Posts.hasMany(Comment, {foreignKey:"postId"});
Comment.belongsTo(Posts, {foreignKey:"postId"});

