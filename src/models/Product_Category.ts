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
import { Field, ID, ObjectType } from "type-graphql";

@Table
@ObjectType()
export class Product_Category extends Model {
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
  @AllowNull(true)
  @ForeignKey(() => Users)
  @Column(DataTypes.INTEGER)
  UserId!: number

  

}
