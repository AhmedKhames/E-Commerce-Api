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
  import { Users } from "./Users";
  
  @Table
  export class UserPhones extends Model {
    @AutoIncrement
    @PrimaryKey
    @Column(DataTypes.INTEGER)
    id!: number;
  
    @AllowNull(true)
    @Column(DataTypes.STRING)
    phoneNumber!: string;
  
    @AllowNull(true)
    @ForeignKey(() => Users)
    @Column(DataTypes.INTEGER)
    UserId!: number;
  }
  