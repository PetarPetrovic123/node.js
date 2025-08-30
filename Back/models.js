import {DataTypes, Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();



export const sequelize = new Sequelize("food",process.env.DB_USER,process.env.DB_PASSWORD,{
    host: "localhost",
    dialect: "mysql"
})

export const Signup = sequelize.define("signup",{
    name:{
        type:DataTypes.STRING
    },
    password:{
        type:DataTypes.STRING
    },
    email:{
        type:DataTypes.STRING
    },
    resetCode: {
        type: DataTypes.STRING,
        allowNull: true
    },
    resetExpires: {
        type: DataTypes.DATE,
        allowNull: true
    }
},{
    tableName:"signup",
    timestamps:false
}
)
