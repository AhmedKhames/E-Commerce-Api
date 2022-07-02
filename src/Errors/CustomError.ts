import { ValidationError } from "express-validator";

export class CustomError {
  message!: string;
  status!: number;
  validationError!:any[]

  constructor(message: string, status: number = 500, errorArr: any[] = []) {
    this.message = message;
    this.status = status;
    this.validationError =  errorArr.map((o) => {
      return { message: o.msg, field: o.param };
    });
  }
}
