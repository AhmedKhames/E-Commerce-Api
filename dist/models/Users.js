"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../utils/database"));
class User extends sequelize_1.Model {
}
exports.default = User;
User.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    address: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    phoneNumer: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
}, { sequelize: database_1.default });
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
