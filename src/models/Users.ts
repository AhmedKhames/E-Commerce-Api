import {
  Column,
  Model,
  Sequelize,
  Table,
  DataType,
  AutoIncrement,
  PrimaryKey,
  NotNull,
  AllowNull,
} from "sequelize-typescript";
import { DataTypes } from "sequelize";

import sequelize from "../utils/database";

@Table
export class Users extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column(DataTypes.INTEGER)
  id!: number;

  @AllowNull(false)
  @Column(DataTypes.STRING)
  name!: string;

  @AllowNull(false)
  @Column(DataTypes.STRING)
  password!: string;

  @AllowNull(false)
  @Column(DataTypes.STRING)
  email!: string;

  @AllowNull(true)
  @Column(DataTypes.STRING)
  address!: string;

  @AllowNull(true)
  @Column(DataTypes.STRING)
  phoneNumber!: string;
}
