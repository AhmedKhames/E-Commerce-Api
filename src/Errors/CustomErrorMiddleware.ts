import { CustomError } from "./CustomError";
import { Request, Response, NextFunction } from "express";

const ErrorHandler = (
  error: TypeError | CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const status = (error as CustomError).status;
  const message = error.message;
  const valErr = (error as CustomError).validationError
  if(valErr && valErr.length > 0){
    res.status(status).json({
        message: message,
        errors:valErr
      });
  } else{
    res.status(status).json({
        message: message,
      });
  }
  
};

export  {
  ErrorHandler,
};
