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
import { ArgsType, Field, ID, InputType, Int, ObjectType } from "type-graphql";
import { type } from "os";

@Table
@ObjectType()
export class Product extends Model {
  
  @Field(type=>ID)
  @AutoIncrement
  @PrimaryKey
  @Column(DataTypes.INTEGER)
  id!: number;

  @Field()
  @AllowNull(false)
  @Column(DataTypes.STRING)
  name!: string;

  @Field()
  @AllowNull(false)
  @Column(DataTypes.STRING)
  imageUrl!: string;

  @Field()
  @AllowNull(false)
  @Column(DataTypes.STRING)
  description!: string;

  @Field()
  @AllowNull(false)
  @Column(DataTypes.DOUBLE)
  price!: number;

  @Field()
  @AllowNull(false)
  @Column(DataTypes.DOUBLE)
  quantity!: number;


  @Field()
  @AllowNull(true)
  @ForeignKey(() => Users)
  @Column(DataTypes.INTEGER)
  UserId!: number

  @Field(type => Int)
  @AllowNull(true)
  @ForeignKey(() => Product_Category)
  @Column(DataTypes.INTEGER)
  ProductCategoryId!: number |undefined
}

