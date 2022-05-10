"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const database_1 = __importDefault(require("./utils/database"));
require("dotenv").config();
// const sequelize = new Sequelize(
//     process.env.DATABASE_NAME!,
//     process.env.DATABASE_USERNAME!,
//     process.env.DATABASE_PASSWORD,
//     {
//       dialect: "mysql",
//       host: process.env.DATABASE_HOST,
//       port: +process.env.DATABASE_PORT!,
//     }
//   );
// const User = sequelize.define('User',{
//     id: {
//       type: DataTypes.INTEGER,
//       autoIncrement: true,
//       primaryKey: true,
//     },
//     email: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     name: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     password: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     address: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     phoneNumer: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//   },);
const app = (0, express_1.default)();
database_1.default
    .sync({ alter: true })
    .then((res) => {
    //console.log(res);
    console.log("Connection has been established successfully.");
    app.listen(process.env.APPLICATION_PORT, () => {
        console.log(`Litening on port  ${process.env.APPLICATION_PORT}`);
    });
})
    .catch((err) => {
    console.error("Unable to connect to the database:", err);
});
