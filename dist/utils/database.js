"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
require("dotenv").config();
const sequelize = new sequelize_1.Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USERNAME, process.env.DATABASE_PASSWORD, {
    dialect: "mysql",
    host: process.env.DATABASE_HOST,
    port: +process.env.DATABASE_PORT,
});
exports.default = sequelize;
