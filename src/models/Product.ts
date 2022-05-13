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
import { Product_Category } from "./Product_Category";

@Table
export class Product extends Model {
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

  @AllowNull(false)
  @Column(DataTypes.DOUBLE)
  price!: number;

  @AllowNull(false)
  @Column(DataTypes.DOUBLE)
  quantity!: number;


  @AllowNull(true)
  @ForeignKey(() => Users)
  @Column(DataTypes.INTEGER)
  UserId!: number

  @AllowNull(true)
  @ForeignKey(() => Product_Category)
  @Column(DataTypes.INTEGER)
  ProductCategoryId!: number |undefined
}
