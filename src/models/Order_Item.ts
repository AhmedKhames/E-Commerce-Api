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
import { Product } from "./Product";
  
  @Table
  export class Order_Item extends Model {
    @AutoIncrement
    @PrimaryKey
    @Column(DataTypes.INTEGER)
    id!: number;

    @Column(DataTypes.INTEGER)
    quantity!: number;

    @AllowNull(true)
    @ForeignKey(() => Product)
    @Column(DataTypes.INTEGER)
    ProductId!: number;
  }
  