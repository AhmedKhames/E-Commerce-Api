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
  // @ForeignKey(() => Users)
  @Column(DataTypes.INTEGER)
  addressId!: number;

  @AllowNull(true)
  // @ForeignKey(() => Users)
  @Column(DataTypes.INTEGER)
  phoneNumberId!: number;


}
