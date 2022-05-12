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
  ForeignKey,
} from "sequelize-typescript";
import { DataTypes } from "sequelize";

import sequelize from "../utils/database";
import { Users } from "./Users";

@Table
export class Product_Category extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column(DataTypes.INTEGER)
  id!: number;

  @AllowNull(false)
  @Column(DataTypes.STRING)
  name!: string;

  @AllowNull(false)
  @Column(DataTypes.STRING)
  imageUrl!: string;

  @AllowNull(false)
  @Column(DataTypes.STRING)
  description!: string;
  
  @AllowNull(true)
  @ForeignKey(() => Users)
  @Column(DataTypes.INTEGER)
  UserId!: number
}
