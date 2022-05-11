import { Sequelize } from "sequelize-typescript";
import path from 'path';
require("dotenv").config();

const sequelize = new Sequelize(
  {
    database: process.env.DATABASE_NAME!,
    username: process.env.DATABASE_USERNAME!,
    password: process.env.DATABASE_PASSWORD,
    models: [path.join(__dirname, "..","models")],
    dialect: "mysql",
    host: process.env.DATABASE_HOST,
    port: +process.env.DATABASE_PORT!,
  }
);

export default sequelize;
