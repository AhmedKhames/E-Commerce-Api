import { Model, Sequelize, DataTypes } from "sequelize";

import sequelize from "../utils/database";

export default class User extends Model {
  declare id: number;
  declare name: string;
  declare email: string;
  declare password: string;
  declare address: string;
  declare phoneNumber: string;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phoneNumer: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {sequelize}
);
//export default User;

// const User = sequelize.define('User',
//     {
//         id: {
//           type: DataTypes.INTEGER,
//           autoIncrement: true,
//           primaryKey: true,
//         },
//         email: {
//           type: DataTypes.STRING,
//           allowNull: false,
//         },
//         name: {
//           type: DataTypes.STRING,
//           allowNull: false,
//         },
//         password: {
//           type: DataTypes.STRING,
//           allowNull: false,
//         },
//         address: {
//           type: DataTypes.STRING,
//           allowNull: false,
//         },
//         phoneNumer: {
//           type: DataTypes.STRING,
//           allowNull: false,
//         },
//       },
// )