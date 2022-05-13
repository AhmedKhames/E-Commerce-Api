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
  export class Cart extends Model {
    @AutoIncrement
    @PrimaryKey
    @Column(DataTypes.INTEGER)
    id!: number;
  
  }
  