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
import { Cart } from "./Cart";
import { Product } from "./Product";
import { Field, ID, ObjectType } from "type-graphql";
import { type } from "os";

@Table
@ObjectType()
export class Cart_item extends Model {
  @Field((type) => ID)
  @AutoIncrement
  @PrimaryKey
  @Column(DataTypes.INTEGER)
  id!: number;

  @Field()
  @Column(DataTypes.INTEGER)
  quantity!: number;

  @Field()
  @AllowNull(true)
  @ForeignKey(() => Cart)
  @Column(DataTypes.INTEGER)
  CartId!: number;

  @Field()
  @AllowNull(true)
  @ForeignKey(() => Product)
  @Column(DataTypes.INTEGER)
  ProductId!: number;
}
