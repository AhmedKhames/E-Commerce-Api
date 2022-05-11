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
  export class Order extends Model {
    @AutoIncrement
    @PrimaryKey
    @Column(DataTypes.INTEGER)
    id!: number;
    
    @AllowNull(false)
    @Column(DataTypes.STRING)
    address!:string;

    @AllowNull(false)
    @Column(DataTypes.STRING)
    phoneNumber!:string;

    @AllowNull(false)
    @Column(DataTypes.STRING)
    total!:string;
  }
  