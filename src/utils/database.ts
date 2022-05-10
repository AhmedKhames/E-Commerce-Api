import { Sequelize } from "sequelize";
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DATABASE_NAME!,
  process.env.DATABASE_USERNAME!,
  process.env.DATABASE_PASSWORD,
  
  {
      
    dialect: "mysql",
    host: process.env.DATABASE_HOST,
    port: +process.env.DATABASE_PORT!,
  }
);

export default sequelize;
