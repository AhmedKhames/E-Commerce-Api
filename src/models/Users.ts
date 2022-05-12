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
// import { HasManyGetAssociationsMixin, HasManyAddAssociationMixin, HasManyHasAssociationMixin, Association, HasManyCountAssociationsMixin, HasManyCreateAssociationMixin } from 'sequelize';

import sequelize from "../utils/database";
import { Product_Category } from "./Product_Category";

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

  // public createProduct_Category?:HasManyGetAssociationsMixin<Product_Category> ;




}
