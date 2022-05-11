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
  export class Cart_item extends Model {
    @AutoIncrement
    @PrimaryKey
    @Column(DataTypes.INTEGER)
    id!: number;

    @Column(DataTypes.INTEGER)
    quantity!: number;
  }
  