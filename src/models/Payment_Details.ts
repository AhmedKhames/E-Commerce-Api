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
  export class Payment_Details extends Model {
    @AutoIncrement
    @PrimaryKey
    @Column(DataTypes.INTEGER)
    id!: number;
    
    @AllowNull(false)
    @Column(DataTypes.INTEGER)
    amount!: number;

    @AllowNull(false)
    @Column(DataTypes.STRING)
    pay_type!:string;

  }
  